"use client"
import Header from "@/app/Header";
import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {listing} from "./getList"
import IframeOverlay from "@/app/components/IframeOveray";


export default function Page(){
    const router = useRouter()
    const { data: session, status } = useSession()
    const [menu, setMenu] = useState("profile");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/");
        }
    }, [status, router]);


    if (status !== "authenticated") return null;
    return (
        <div>
            <Header />
            <main className="main">
                <span id="profile_menu" className={"menu"}>
                    <hr/>
                    <button id={"info_bt"} className={"pf_menu_bt"} onClick={() => setMenu("profile")}>
                        프로필
                    </button>
                    <hr/>
                    <button id={"info_list"} className={"pf_menu_bt"} onClick={() => setMenu("list")}>
                        나의 디시콘
                    </button>
                    <hr/>
                </span>
                {menu === "profile" && profile(session.user.discordId, session.user.image, session.user.name)}
                {menu === "list" && <ListUp discordId={session.user.disordId}/>}
            </main>
            <span className={"button"} style={{"marginRight": "5%", "display": "flex", "justifyContent": "right"}}>
                <button id={"Discord_logout"} onClick={() => signOut()}>
                    Sign Out
                </button>
            </span>
        </div>
    )
}

function ListUp(){
    const [list, setList] = useState(null);
    const [url, setUrl] = useState(null);
    useEffect(() => {
        console.log("effect");
        (async () => {
            const response = await fetch("api/controller");
            const json = await response.json();
            const list = json.list;
            const info_list = await listing(list);
            setList(info_list);
        })()
    }, [])

    function Delete(event){
        const el = event.target.closest("[dccon_idx]");
        if(!el) return;
        fetch("api/controller",{
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({idx: el.getAttribute("dccon_idx")})
        }).then((res) => res.json()).then((data) => {
            if(data.success) {
                alert("삭제에 성공하였습니다");
                el.parentElement.parentElement.remove();
            }
            else
                alert(data.message);
        }).catch(err => {
            alert("삭제 중 오류가 발생하였습니다.");
            console.error(err);
        })
    }
    const iframe_clicker = (event) =>{
        const el = event.target.closest("[dccon-idx]");
        if (!el) return;
        setUrl(`/components/info?idx=${el.getAttribute("dccon-idx")}`)
    }


    return (
        <div className={"profile_list"}>
            <hr/>
            <div>
                <div className={"dccon_listing"}>
                    <p>이미지</p><p className={"dccon_listing_title"}>이름</p><p>삭제</p>
                </div>
                <hr/>
            </div>
            {list !== null && list.map((item, i) => {
                return <div key={`dccon${i}`}><div className={"dccon_listing"}><img src={`/api/img?u=${encodeURIComponent(item.main_img)}`} alt={"dccon_img"}/><div className={"dccon_listing_title"} dccon-idx={item.idx} onClick={iframe_clicker} style={{cursor: "pointer"}}>{item.title}</div><button className={"delete_dccon"} dccon_idx={item.idx} onClick={Delete}>X</button></div><hr/></div>
            })}
            {url && <IframeOverlay url={url} onClose={() => setUrl(null)} />}
        </div>
    )
}

function profile(discordId, img, name){
    return (
        <div className={"profile_list"}>
            <img src={img} alt={"profile image"}/><br/>name: {name}<br/> ID: {discordId}
        </div>
    )
}