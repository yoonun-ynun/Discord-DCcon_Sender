"use client"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import {useRouter} from "next/navigation";

export default function Header(){
    const { data: session } = useSession()
    const router = useRouter();


    if(session){
        return (
            <div id={"header"}>
            <span style={{color: "white", "display": "flex", "justifyContent": "flex-start"}} id="title">
                <a href={"/"}>
                    <span style={{"fontSize": "1.4rem", "margin": "0", "padding": "0"}}>DCcon</span><br/><span style={{"margin": "0"}}>Sender</span>
                </a>
            </span>
                <span className={"button"} style={{"marginRight": "5%"}}>
                <button id={"Discord_login"} onClick={() => {router.push("/profile")}}>
                    <img src={"/Discord-Symbol.svg"} alt={"Discord_icon"} id={"Discord_symbol"}/>
                    {session.user.name}
                </button>
            </span>
            </div>
        )
    }
    return (
        <div id={"header"}>
            <span style={{color: "white", "display": "flex", "justifyContent": "flex-start"}} id="title">
                <a href={"/"}>
                    <span style={{"fontSize": "1.4rem", "margin": "0", "padding": "0"}}>DCcon</span><br/><span style={{"margin": "0"}}>Sender</span>
                </a>
            </span>
            <span className={"button"} style={{"marginRight": "5%"}}>
                <button id={"Discord_login"} onClick={() => signIn("discord")}>
                    <img src={"/Discord-Symbol.svg"} alt={"Discord_icon"} id={"Discord_symbol"}/>
                    Sign In
                </button>
            </span>
        </div>
    )
}