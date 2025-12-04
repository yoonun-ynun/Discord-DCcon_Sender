import { type Message } from '../connection/Message.js';

export async function handler(message: Message) {
    if (message.t === 'MESSAGE_CREATE') {
        console.log(message?.d?.author?.username + ': ' + message.d?.content);
    }
}
