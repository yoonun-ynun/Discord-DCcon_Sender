import mongoose from "mongoose";
import {startSocket} from "./connection/connect.js";
import dotenv from "dotenv";

dotenv.config();

if(process.env["MONGO_URI"] === undefined)  throw Error("MONGO_URI is required");
if(process.env["DISCORD_TOKEN"] === undefined)  throw Error("DISCORD_TOKEN is required");
mongoose.connect(process.env["MONGO_URI"], {
    dbName: "Discord",
}).then(() => {
    console.log("데이터베이스에 연결되었습니다.");
    startSocket();
})