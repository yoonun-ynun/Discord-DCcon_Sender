"use client"

import {useState} from "react";
import IframeOverlay from "@/app/components/IframeOveray";
import Bar from "@/app/Bar"
import Header from "@/app/Header"
import {useDcconSync} from "@/store/queryList.js";

export default function Tabs({ initialData }) {
    const [active, setActive] = useState(0);
    const [url, setUrl] = useState(null);
    useDcconSync();

    const iframe_clicker = (event) =>{
        const el = event.target.closest("[dccon-idx]");
        if (!el) return;
        setUrl(`/components/info?idx=${el.getAttribute("dccon-idx")}`)
    }

    const handleClick = (idx) => {
        setActive(idx);
    };

    return (
        <div>
            <Header/>
            <Bar/>
            <div id={"body"}>
                <div id={"selector"} data-active={active} className={"tabs"}>
                    <span id={"monthly"} data-idx={0} className={`hot ${active === 0 ? "active" : ""}`} onClick={() => handleClick(0)}>일간 인기 디시콘</span>
                    <span id={"weekly"} data-idx={1} className={`hot ${active === 1 ? "active" : ""}`} onClick={() => handleClick(1)}>주간 인기 디시콘</span>
                    <span className={"pill"} aria-hidden="true"></span>
                </div>
                <div className={"list_wrapper"}>
                    <div className={"list"}>
                        <span id={"hot_1"} className={"hot_item"} dccon-idx={active === 0 ? initialData.day[0].package_idx : initialData.week[0].package_idx} onClick={iframe_clicker}>
                            <div className={"img-bg"}><img src={active === 0 ? `/api/img?u=${encodeURIComponent(initialData.day[0].img)}` : `/api/img?u=${encodeURIComponent(initialData.week[0].img)}`} alt={"DCcon image"} className={"image"}/></div>
                            <div className={"title_field"}>{active === 0 ? initialData.day[0].title : initialData.week[0].title}</div>
                        </span>
                        <span id={"hot_2"} className={"hot_item"} dccon-idx={active === 0 ? initialData.day[1].package_idx : initialData.week[1].package_idx} onClick={iframe_clicker}>
                            <div className={"img-bg"}><img src={active === 0 ? `/api/img?u=${encodeURIComponent(initialData.day[1].img)}` : `/api/img?u=${encodeURIComponent(initialData.week[1].img)}`} alt={"DCcon image"} className={"image"}/></div>
                            <div className={"title_field"}>{active === 0 ? initialData.day[1].title : initialData.week[1].title}</div>
                        </span>
                        <span id={"hot_3"} className={"hot_item"} dccon-idx={active === 0 ? initialData.day[2].package_idx : initialData.week[2].package_idx} onClick={iframe_clicker}>
                            <div className={"img-bg"}><img src={active === 0 ? `/api/img?u=${encodeURIComponent(initialData.day[2].img)}` : `/api/img?u=${encodeURIComponent(initialData.week[2].img)}`} alt={"DCcon image"} className={"image"}/></div>
                            <div className={"title_field"}>{active === 0 ? initialData.day[2].title : initialData.week[2].title}</div>
                        </span>
                        <span id={"hot_4"} className={"hot_item"} dccon-idx={active === 0 ? initialData.day[3].package_idx : initialData.week[3].package_idx} onClick={iframe_clicker}>
                            <div className={"img-bg"}><img src={active === 0 ? `/api/img?u=${encodeURIComponent(initialData.day[3].img)}` : `/api/img?u=${encodeURIComponent(initialData.week[3].img)}`} alt={"DCcon image"} className={"image"}/></div>
                            <div className={"title_field"}>{active === 0 ? initialData.day[3].title : initialData.week[3].title}</div>
                        </span>
                        <span id={"hot_5"} className={"hot_item"} dccon-idx={active === 0 ? initialData.day[4].package_idx : initialData.week[4].package_idx} onClick={iframe_clicker}>
                            <div className={"img-bg"}><img src={active === 0 ? `/api/img?u=${encodeURIComponent(initialData.day[4].img)}` : `/api/img?u=${encodeURIComponent(initialData.week[4].img)}`} alt={"DCcon image"} className={"image"}/></div>
                            <div className={"title_field"}>{active === 0 ? initialData.day[4].title : initialData.week[4].title}</div>
                        </span>
                    </div>
                </div>
                {url && <IframeOverlay url={url} onClose={() => setUrl(null)} />}
            </div>
            <hr/>
            <div id={"footer"}>

            </div>
        </div>
    );
}

