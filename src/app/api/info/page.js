import './iframe.css'
import Button from "@/app/api/info/Button";

export default async function Page({ searchParams }){
    const params = await searchParams;
    const idx = params.idx;
    const data = await dccon_info(idx);
    return (
        <div id={"class_doc"}>
            <div id={"main"}>
                <img src={`/api/img?u=${encodeURIComponent(data.main_img)}`}  alt={"main image"} className={"dccon_img"} id={"main-img"}/>
                <div className={"info_wrap"}>
                    <div className={"text_field"}>
                        <span className={"title_field"}>{data.title}</span><br/>
                        <span id={"description"}>{data.description}</span>
                    </div>
                    <Button lists={data.path} title={data.title} idx={idx}/>
                </div>
            </div>
            <hr/>
            <div className={"image_list"}>
                {data.path.map((item,i) => {
                    return (<img src={`/api/img?u=${encodeURIComponent(item.addr)}`}  alt={"path image"} key={i} className={"dccon_img"}/>)
                })}
            </div>

        </div>
    )
}

async function dccon_info(pkg_number){
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
    data.path = [];
    res.detail.forEach((item) => {data.path.push({addr: `//dcimg5.dcinside.com/dccon.php?no=${item.path}`, ext: item.ext})});

    return data;
}