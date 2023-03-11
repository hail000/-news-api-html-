let news= [];
let search_text = document.getElementById("search-input");
let search_button = document.getElementById("search-button");
let menus= document.querySelectorAll(".news_menu button");
menus.forEach((menu) => menu.addEventListener("click", (event)=>getNewByTopic(event)));

// https://app.newscatcherapi.com/dashboard/ 참조API제공 사이트
const html_AIP_search = async(url)=>{ //뉴스 api 
    try{
        let header = new Headers({'x-api-key':'Lt6j9Qm1d6vbeZdo0d3zeMAOUVx3on0lapp_FLBRpqo'});
        let response = await fetch(url,{headers:header});
        let data = await response.json();
        console.log(data);
        if(response.status == 200){
            if(data.total_hits == 0 ){
                throw new Error("검색된 뉴스는 없습니다.");
            }else if(data.error_code == "LimitReached" ){
                throw new Error("사용기한이 만료되었습니다.");
            }
            
            news = data.articles;
            //console.log(news);
            render();
        } else{
            throw new Error(data.message);
        }
    } catch (error){
        console.log(error.message);
        error_ms(error.message);
    }
}

const error_ms = (message) => {
    let errorHTML = `<div class="alert alert-info text-center" role="alert"  > ${message} </div>`;
    document.getElementById("news_main").innerHTML = errorHTML;
};


const render = () =>{ //html수정 
    let newsHTML= ``;
    newsHTML = news.map((news_item)=>{
        return ` <div class="row line">
        <div class="col-lg-4">
            <img class="news_img" src ="${news_item.media}">
        </div>
        <div class="col-lg-7">
            <h2>${news_item.title}</h2>
            <p>${news_item.summary}</p>
            <div>
                ${news_item.published_date} ${news_item.rights}
            </div>
        </div>
    </div>`
    }).join('');
    //console.log(newsHTML);
    document.getElementById("news_main").innerHTML = newsHTML;
};


const gettnewbykeyword = async() =>{ //검색
    let keyword = document.getElementById("search-input").value;
    let url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=5`);
    html_AIP_search(url);
};
search_button.addEventListener("click",gettnewbykeyword);


const getLatestNew = async()=>{ //첫화면 최신뉴스
    let url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=5');
    html_AIP_search(url);
};


const getNewByTopic = async(event) =>{ // 메뉴 타이틀 검색
    console.log("클릭",event.target.textContent);
    let topic = event.target.textContent.toLowerCase();
    let url =new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=5&topic=${topic}`);
    html_AIP_search(url);
};





getLatestNew();