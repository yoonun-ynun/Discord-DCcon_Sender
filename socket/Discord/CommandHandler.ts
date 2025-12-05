import { type Message } from '../connection/Message.js';

export async function handler(message: Message) {
    if (message.t === 'MESSAGE_CREATE') {
        if (message.d === undefined) return;
        const author = message.d['author'];
        if (typeof author !== 'object' || author === null) return;
        console.log((author as { username: string }).username + ': ' + message.d['content']);
    }
}
