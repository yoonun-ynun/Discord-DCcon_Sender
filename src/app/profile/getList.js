"use server"

export async function listing(list){
    const result = [];
    for(let i = 0;i<list.length;i++){
        const item = list[i];
        let info;
        try {
            info = await dccon_info(item);
        }catch(error){
            info = result.push({success: false, idx: item})
        }
        result.push(info);
    }
    return result;
}

async function dccon_info(pkg_number){
    console.log("input");
    let data = {};

    let body = new FormData();
    body.append('package_idx', pkg_number);

    let stream = await fetch('https://dccon.dcinside.com/index/package_detail', {
        method: 'POST',
        headers: {
            'x-requested-with': 'XMLHttpRequest',
            referer: 'https://dccon.dcinside.com/index/package_list',
        },
        body: body
    })
    let res = await stream.json();
    data.title = res.info.title;
    data.description = res.info.description;
    data.main_img = `//dcimg5.dcinside.com/dccon.php?no=${res.info.main_img_path}`
    data.idx = pkg_number;

    return data;
}