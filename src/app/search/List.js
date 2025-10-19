"use client"
import {useState} from "react";
import IframeOverlay from "@/app/components/IframeOveray";

export default function List({Params}){
    const [url, setUrl] = useState(null);

    const iframe_clicker = (event) =>{
        const el = event.target.closest("[dccon-idx]");
        if (!el) return;
        setUrl(`/api/info?idx=${el.getAttribute("dccon-idx")}`)
    }

    return (
        <div>
            <div className={"list_wrapper"}>
                <div className={"list"}>
                    {Params.map((item,i) => {
                        return (
                            <span id={`hot_${i}`} className={"hot_item"} dccon-idx={item.idx} onClick={iframe_clicker} key={i}>
                                    <div><img src={`/api/img?u=${item.img.substring(6)}`} alt={"DCcon image"} className={"image"}/></div>
                                    <div className={"title_field"}>{item.title}</div>
                            </span>
                        )
                    })}
                </div>
            </div>
        {url && <IframeOverlay url={url} onClose={() => setUrl(null)} />}
        </div>
    )
}
