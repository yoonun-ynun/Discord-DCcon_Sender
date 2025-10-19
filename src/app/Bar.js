"use client"

import {useEffect, useState} from "react";

export default function Bar({getting_word}){
    const [word, setWord] = useState("");

    useEffect(() => {
        if (getting_word) setWord(getting_word);
    }, [getting_word]);

    useEffect(() => {

        const onKey = (e) => {
            if (e.key === "Enter") window.location.href = `/search?word=${encodeURIComponent(document.querySelector(".bar").value)}`;
        };
        document.querySelector(".bar").addEventListener("keydown", onKey);
    });

    return(
        <div id={"Search"}>
            <div id={"Search_bar"}>
                <input className={"bar"} value={word} onChange={(e) => setWord(e.target.value)}/>
                <a href={`/search?word=${encodeURIComponent(word)}`} style={{display: "flex"}}>
                    <button className={"Search_bt"}><img src={"/search.png"} alt={"검색하기"} id={"Search_image"}/></button>
                </a>
            </div>
        </div>
    )
}