import WebSocket from 'ws';
import {getSequence, sendHeartbeat, setAck, setSequence, stopHeartbeat} from "./heartbeat.js";
import {Opcode} from "./Opcode.js";

let shouldResume = false;
let pendingSessionId:string | null = null;
let socket: WebSocket | null = null;
let isReconnecting: boolean = false;
let resumeGateway: string | null = null;

export function startSocket(){
    socket = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
    socket.on('open', () => {
        console.log("WebSocket connection opened to Discord");
    });
    handleConnect();
}

function manageSocket(event:WebSocket.RawData){
    if(socket === null) throw Error("Socket is not connected");
    const message = JSON.parse(event.toString());
    const command:Opcode = message.op;
    if(message.s !== null && message.s !== undefined)   setSequence(message.s);
    if(command === Opcode.DISPATCH){
        console.log(message.d)
    }
    if(command === Opcode.DISPATCH && message.t === "READY"){
        resumeGateway = message.d.resume_gateway_url;
        pendingSessionId = message.d.session_id;
        socket.send(JSON.stringify({
            "op": Opcode.PRESENCE_UPDATE,
            "d": {
                "since": null,
                "activities": [{
                    "name": "봇인 사실을 즐기는 중",
                    "type": 0
                }],
                "status": "online",
                "afk": false
            }
        }))
    }
    if(command === Opcode.RECONNECT){
        reconnectSocket(true);
    }
    if(command === Opcode.INVALID_SESSION){
        if(message.d){
            reconnectSocket(true);
        }else{
            reconnectSocket(false);
        }
    }
    if(command === Opcode.HELLO){
        sendHeartbeat(socket, message.d.heartbeat_interval, () => {console.log("Timed out, Reconnecting.."); reconnectSocket(true)});
        if(shouldResume && pendingSessionId){
            sendResume();
            shouldResume = false;
            return;
        }
        sendIdentify();
    }
    if(command === Opcode.HEARTBEAT_ACK){
        console.log("Heartbeat ACK");
        setAck();
    }
}

function sendIdentify(){
    if(socket === null) throw Error("Socket is not connected");
    const data = JSON.stringify({
        op: Opcode.IDENTIFY,
        d: {
            token: process.env["DISCORD_TOKEN"],
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
    if(!socket) throw Error("Socket is not connected");
    socket.removeAllListeners('close');
    socket.removeAllListeners('error');
    socket.removeAllListeners('message');
    socket.removeAllListeners('open');

    socket.terminate();
    console.log("Socket Cleaned up")
}

function reconnectSocket(isResume: boolean){
    if(isReconnecting){
        console.log("Socket is already Reconnecting, skipping");
        return;
    }
    isReconnecting = true;
    cleanupSocket();
    stopHeartbeat();

    setTimeout(() => {
        isReconnecting = false;
        if(resumeGateway && isResume){
            console.log("Resuming socket connection");
            socket = new WebSocket(resumeGateway);
            socket.on('open', () => {
                console.log("WebSocket connection resumed to Discord");
                shouldResume = true;
            })
            handleConnect();
        }else{
            console.log("Reconnect to Discord");
            resumeGateway = null;
            startSocket();
        }
    }, 1000)
}

function sendResume(){
    if(socket === null) throw Error("Socket is not connected");
    if (socket.readyState === 1) {
        console.log("Sending resume message");
        socket.send(JSON.stringify({
            op: Opcode.RESUME,
            d: {
                token: process.env["DISCORD_TOKEN"],
                session_id: pendingSessionId,
                seq: getSequence()
            }
        }));
    }else{
        console.log("Socket is not open, cannot send resume message");
    }
}

function handleConnect(){
    if(socket === null) throw Error("Socket is not connected");
    socket.on('message', manageSocket);
    socket.on('close', (code: number, reason:Buffer) => {
        console.log("WebSocket closed:", code, reason.toString());
        if ([4004, 4010, 4011, 4012, 4013, 4014].includes(code)) {
            console.error("Fatal gateway close code, check token/intents/privileged settings!");
            return;
        }
        reconnectSocket(true);
    })
    socket.on('error', () => {
        console.log("WebSocket connection error");
    })
}