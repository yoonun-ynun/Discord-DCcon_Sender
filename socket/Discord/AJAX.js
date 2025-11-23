const base_url = "https://discord.com/api"
export function fetchDiscord(route, body, method, files){
    const url = base_url + route;
    const headers = {
        "Authorization": `Bot ${process.env.DISCORD_TOKEN}`,
        "User-Agent": `DCcon_Sender (${process.env.AUTH_URL}, 1.0)`,
        "Content-Type": "application/json"
    }

    const form = new FormData();
    body.attachments = [];
    for(let i = 0; i < files.length; i++){
        body.attachments.push({
            id: i,
            name: files[i].name,
        })
    }
    form.append("payload_json", JSON.stringify(body));
    for(let i = 0;i<files.length;i++){
        form.append(`files[${i}]`, files[i]);
    }
    const option = {
        method: method,
        headers: headers,
        body: form,
    }

}