"use server"
import {dccon_info} from "@/lib/fetchDC";

export async function listing(list){
    const result = [];
    for(let i = 0;i<list.length;i++){
        const item = list[i];
        let info;
        try {
            info = await dccon_info(item);
        }catch(error){
            result.push({success: false, idx: item})
        }
        result.push(info);
    }
    return result;
}