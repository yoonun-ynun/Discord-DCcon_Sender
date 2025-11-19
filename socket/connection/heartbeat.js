let sequence = null;
let timeout = null;
let lastAck = true;

export function sendHeartbeat(socket, Interval, onTimeout){
    stopHeartbeat();
    lastAck = true;
    function send() {
        if (socket.readyState === 1) {
            if(!lastAck){
                console.log("Don't Receive Ack");
                onTimeout();
                return;
            }
            console.log("Sending Heartbeat");
            socket.send(JSON.stringify(
                {
                    op: 1,
                    d: sequence,
                }
            ))
            lastAck = false;
        }else{
            console.log("socket is not open");
            onTimeout();
            return;
        }
        timeout = setTimeout(send, Interval);
    }
    send();
}

export function setAck(){
    lastAck = true;
}

export function stopHeartbeat(){
    if(timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
}

export function setSequence(s){
    sequence = s;
}

export function getSequence(){
    return sequence;
}