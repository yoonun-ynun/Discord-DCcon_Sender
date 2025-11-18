import mongoose from "mongoose";
import {startSocket} from "./connection/connect";

mongoose.connect(process.env.MONGO_URI, {
    dbName: "Discord",
}).then(() => {
    console.log("데이터베이스에 연결되었습니다.");
    startSocket();
})