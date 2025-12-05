const base_url = 'https://discord.com/api';
export async function createMessage(channel_id: string, body: DiscordMessageBody, files: File[]) {
    files = files || [];
    const url = base_url + `/channels/${channel_id}/messages`;
    const headers = {
        Authorization: `Bot ${process.env['DISCORD_TOKEN']}`,
        'User-Agent': `DCcon_Sender (${process.env['AUTH_URL']}, 1.0)`,
    };

    const form = new FormData();
    const payload: DiscordMessagePayload = { ...body, attachments: [] };
    for (let i = 0; i < files.length; i++) {
        payload.attachments.push({
            id: i,
            filename: files[i].name,
        });
    }
    form.append('payload_json', JSON.stringify(payload));
    for (let i = 0; i < files.length; i++) {
        form.append(`files[${i}]`, files[i]);
    }
    const option = {
        method: 'POST',
        headers: headers,
        body: form,
    };
    try {
        const response = await fetch(url, option);
        if (response.status === 204) {
            return { ok: true };
        }
        return {
            ok: true,
            message: await response.json(),
        };
    } catch (e: unknown) {
        console.error(e);
        if (!(e instanceof Error)) {
            console.log(e);
            return;
        }
        const message = e?.message ?? '';
        return {
            ok: false,
            message: message,
        };
    }
}

interface DiscordMessageBody {
    content?: string;
    nonce?: string | number;
    tts?: boolean;
    embeds?: object[];
    allowed_mentions?: {
        parse?: ('users' | 'roles' | 'everyone')[];
        roles?: string[];
        users?: string[];
        replied_user?: boolean;
    };
    message_reference?: {
        type: 0 | 1;
        message_id?: string;
        channel_id?: string;
        guild_id?: string;
        fail_if_not_exists?: boolean;
    };
    components?: object[];
    sticker_ids?: string[];
    enforce_nonce?: boolean;
    poll?: {
        question: {
            text: string;
        };
        answers: {
            answer_id: number;
            poll_media: {
                text: string;
            };
        }[];
        /** ISO 8601 timestamp, use Date.toISOString() */
        expiry: string;
        allow_multiselect: boolean;
        layout_type: number;
        results?: {
            is_finalized: boolean;
            answer_counts: {
                id: number;
                count: number;
                me_voted: boolean;
            }[];
        };
    };
}

interface DiscordMessagePayload extends DiscordMessageBody {
    attachments: {
        id: number;
        filename: string;
    }[];
}
