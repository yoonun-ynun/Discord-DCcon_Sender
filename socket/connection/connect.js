import WebSocket from 'ws';
import {getSequence, sendHeartbeat, setAck, setSequence, stopHeartbeat} from "./heartbeat";

let shouldResume = false;
let pendingSessionId = null;
let socket = null;
let isReconnecting = false;
let resumeGateway = null;

export function startSocket(){
    socket = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
    socket.on('open', () => {
        console.log("WebSocket connection opened to Discord");
        isReconnecting = false;
    });
    socket.on('message', manageSocket);
    socket.on('close', () => {
        console.log("WebSocket connection closed");
        reconnectSocket(true);
    })
    socket.on('error', () => {
        console.log("WebSocket connection error");
    })
}

function manageSocket(event){
    const message = JSON.parse(event.toString());
    const command = message.op;
    if(message.s !== null && message.s !== undefined)   setSequence(message.s);
    if(command === 0 && message.t === "READY"){
        resumeGateway = message.d.resume_gateway_url;
        pendingSessionId = message.d.session_id;
    }
    if(command === 7){
        reconnectSocket(true);
    }
    if(command === 9){
        if(message.d){
            reconnectSocket(true);
        }else{
            reconnectSocket(false);
        }
    }
    if(command === 10){
        sendHeartbeat(socket, message.d.heartbeat_interval, () => {console.log("Timed out, Reconnecting.."); reconnectSocket(true)});
        if(shouldResume && pendingSessionId){
            sendResume();
            shouldResume = false;
            return;
        }
        sendIdentify();
    }
    if(command === 11){
        console.log("Heartbeat ACK");
        setAck();
    }
}

function sendIdentify(){
    const data = JSON.stringify({
        op: 2,
        d: {
            token: process.env.DISCORD_TOKEN,
            intents: 65071,
            properties: {
                os: "linux",
                browser: "DiscordBot",
                device: "computer"
            }
        }
    });
    socket.send(data);
}

function cleanupSocket(){
    if(!socket) return;
    socket.removeAllListeners('close');
    socket.removeAllListeners('error');
    socket.removeAllListeners('message');
    socket.removeAllListeners('open');

    socket.terminate();
    console.log("Socket Cleaned up")
}

function reconnectSocket(isResume){
    if(isReconnecting){
        console.log("Socket is already Reconnecting, skipping");
        return;
    }
    isReconnecting = true;
    cleanupSocket();
    stopHeartbeat();

    setTimeout(() => {
        if(resumeGateway && isResume){
            console.log("Resuming socket connection");
            socket = new WebSocket(resumeGateway);
            socket.on('open', () => {
                console.log("WebSocket connection resumed to Discord");
                isReconnecting = false;
                shouldResume = true;
            })
            socket.on('message', manageSocket);
            socket.on('close', () => {
                console.log("WebSocket connection closed");
                reconnectSocket(true);
            })
            socket.on('error', () => {
                console.log("WebSocket connection error");
            })
        }else{
            console.log("Reconnect to Discord");
            resumeGateway = null;
            startSocket();
        }
    }, 1000)
}

function sendResume(){
    // Send a resume message to Discord to resume the session
    if (socket.readyState === 1) {
        console.log("Sending resume message");
        socket.send(JSON.stringify({
            op: 6,
            d: {
                token: process.env.DISCORD_TOKEN, // Your bot token
                session_id: pendingSessionId, // The session ID you stored when the bot was last connected
                seq: getSequence() // The last sequence number received
            }
        }));
    }else{
        console.log("Socket is not open, cannot send resume message");
    }
}