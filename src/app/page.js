import Tabs from "@/app/Tabs";

export default async function Home() {
    let day = await day_top();
    let week = await week_top();
    let data = {day: day, week: week}

    return <Tabs initialData={data}/>;
}

async function day_top(){
    let res = await fetch('https://json2.dcinside.com/json1/dccon_day_top5.php?4&jsoncallback=day_top5', {
        method: 'GET',
        headers: {
            'referer': 'https://dccon.dcinside.com/'
        }
    })
    let data = await res.text();
    let response = data.substring(9, data.length - 1);  //JSONP to JSON
    response = JSON.parse(response);
    return response;
}

async function week_top(){
    let res = await fetch('https://json2.dcinside.com/json1/dccon_week_top5.php?1&jsoncallback=week_top5', {
        method: 'GET',
        headers: {
            'referer': 'https://dccon.dcinside.com/'
        }
    })

    let data = await res.text();
    var response = data.substring(10, data.length - 1); //JSONP to JSON
    response = JSON.parse(response);
    return response;
}