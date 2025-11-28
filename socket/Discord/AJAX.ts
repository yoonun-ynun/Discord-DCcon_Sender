const base_url = "https://discord.com/api";
export async function createMessage(channel_id: string,body: DiscordMessageBody, files: File[]){
    files = files || [];
    const url = base_url + `/channels/${channel_id}/messages`;
    const headers = {
        "Authorization": `Bot ${process.env["DISCORD_TOKEN"]}`,
        "User-Agent": `DCcon_Sender (${process.env["AUTH_URL"]}, 1.0)`,
    }

    const form = new FormData();
    const payload:DiscordMessagePayload = {...body, attachments: []};
    for(let i = 0; i < files.length; i++){
        payload.attachments.push({
            id: i,
            filename: files[i].name,
        })
    }
    form.append("payload_json", JSON.stringify(payload));
    for(let i = 0;i<files.length;i++){
        form.append(`files[${i}]`, files[i]);
    }
    const option = {
        method: "POST",
        headers: headers,
        body: form,
    }
    try{
        const response = await fetch(url, option);
        if(response.status === 204){
            return {ok: true};
        }
        return {
            ok: true,
            message: await response.json()
        };
    }catch(e){
        console.error(e);
        let message = "";
        if(e instanceof Error){
            message = e.message;
        }
        return {
            ok: false,
            message: message,
        }
    }
}


interface DiscordMessageBody{
    content?: string;

}

interface DiscordMessagePayload extends DiscordMessageBody{
    attachments: {
        id: number;
        filename: string;
    }[];
}