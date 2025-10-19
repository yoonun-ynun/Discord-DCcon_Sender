import Bar from "@/app/Bar";
import Header from "@/app/Header";
import jsdom from 'jsdom';
import List from "@/app/search/List";


export default async function Page({searchParams}){

    const params = await searchParams;
    const word = params.word;
    let search_res = await search(word);
    return (
        <div>
            <Header/>
            <Bar getting_word={word}/>
            <List Params={search_res}/>
        </div>
    )
}

async function search(text){
    async function getSearch(word, page){
        let result = await fetch(`https://dccon.dcinside.com/hot/${page}/title/${encodeURIComponent(word)}`, {
            method: 'GET',
            headers: {
                'referer': 'https://dccon.dcinside.com/'
            }
        })
        if(!result.ok)  return undefined;
        result = await result.text();
        return new jsdom.JSDOM(result);
    }
    let i = 1;
    const result = [];
    while(true){
        let res = await getSearch(text, i++);
        if(!res)    return [];
        if(res.window.document.querySelector('.dccon_search_none')) return [];                                  //검색결과 없을 때 신상 디시콘으로 진입하는 것 방지
        if(res.window.document.querySelector('.dccon_shop_list')?.childNodes.length === 1) break;
        res.window.document.querySelector('.dccon_shop_list').childNodes.forEach(item => {
            if(!item.data){
                let data = {
                    title: item.querySelector('.dcon_name').innerHTML,
                    idx: item.getAttribute('package_idx'),
                    img: item.querySelector('.thumb_img').getAttribute('src')
                }
                result.push(data);
            }
        });
    }
    return result;
}