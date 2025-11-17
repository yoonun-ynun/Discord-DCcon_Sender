import Tabs from "@/app/Tabs";
import {day_top, week_top} from "@/lib/fetchDC";

export default async function Home() {
    let day = await day_top();
    let week = await week_top();
    let data = {day: day, week: week}

    return <Tabs initialData={data}/>;
}