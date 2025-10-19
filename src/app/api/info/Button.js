"use client"
import "./iframe.css"
import JSZip from "jszip"
import {saveAs} from "file-saver"
import {useState} from "react";


export default function Button({lists, title}){
    const [progress, setProgress] = useState(0);
    const [progress_max, setProgress_max] = useState(0);
    const handleZip = async () => {
        console.log("start download");
        const zip = new JSZip();
        setProgress_max(lists.length);

        for(let i = 0; i<lists.length; i++){
            let response = await fetch(`/api/img?u=${encodeURIComponent(lists[i].addr)}`)
            if(!response.ok)    continue;
            let blob = await response.blob();

            if(response.headers.get("content-Type")) {
                zip.file(`${i}.${lists[i].ext}`, blob);
            }else{
                zip.file(`${i}.png`, blob);
            }
            console.log(`zip ${i} successed`);
            setProgress(i+1);
        }
        const content = await zip.generateAsync({ type: "blob" });
        console.log("generated");

        saveAs(content, `${title}.zip`);
        console.log("saved");
    };
    return (
        <div className="button_group">
            <button className="btn_download" onClick={handleZip}>다운로드</button>
            <button className="btn_add">추가</button>
            {progress > 0 &&
                <div id={"progress"}>
                    <progress id={"download_progress"} max={progress_max} value={progress}></progress>
                </div>
            }
        </div>
    )
}