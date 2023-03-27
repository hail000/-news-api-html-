let news= [];
let page=  1;
let total_page = 1;
let search_text = document.getElementById("search-input");
let search_button = document.getElementById("search-button");
let menus= document.querySelectorAll(".news_menu button");
menus.forEach((menu) => menu.addEventListener("click", (event)=>getNewByTopic(event)));
let url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=5');

// https://app.newscatcherapi.com/dashboard/ 참조API제공 사이트
const html_AIP_search = async(url,page)=>{ //뉴스 api 
    try{
        let header = new Headers({'x-api-key':'UoOEox_oAVvVp74J2ZIkpa9vW68-gO2WLACGnv_tjak'});
        url.searchParams.set('page',page);
        console.log("url",url);
        let response = await fetch(url,{headers:header});
        let data = await response.json();
        console.log(data);
        if(response.status == 200){
            if(data.total_hits == 0 ){
                throw new Error("검색된 뉴스는 없습니다.");
            }else if(data.error_code == 'LimitReached' ){ 
                throw new Error("사용기한이 만료되었습니다.");
            }
            
            news = data.articles;
            //console.log(news);
            total_page = data.total_pages;
            page = data.page;
            console.log(data.total_pages);
            console.log(total_page);
            render();
            pagenation();
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
    document.getElementById("news_main").innerHTML = newsHTML;
};
const moveToPage = (pageNum)=>{
    page = pageNum;
    console.log(page);
    html_AIP_search(url,page);
}


const pagenation = ()=> {
    let paginationHTML =``;
    let pageGroup = Math.ceil(page/5);
    let last = pageGroup*5;
    let first = last -4 ;
    if (first >= 6) {
    paginationHTML += ` 
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1})">
        <span aria-hidden="true">&lt&lt;</span>
      </a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
        <span aria-hidden="true">&lt;</span>
      </a>
    </li>`;
    };
    for(let i=first; i<=last; i++){
        paginationHTML +=` <li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})":>${i}</a></li>`;

    };
    if (last < total_Page) {
    paginationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
      <span aria-hidden="true">&gt;</span>
    </a>
    </li>
    <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${total_page})">
      <span aria-hidden="true">&gt&gt;</span>
    </a>
    </li>
    `;
    };
    document.querySelector(".pagination").innerHTML =paginationHTML;
}


const gettnewbykeyword = async() =>{ //검색
    let keyword = document.getElementById("search-input").value;
    let url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=5`);
    html_AIP_search(url);
};
search_button.addEventListener("click",gettnewbykeyword);


const getLatestNew = async()=>{ //첫화면 최신뉴스
    html_AIP_search(url);
    console.log(total_page);
};


const getNewByTopic = async(event) =>{ // 메뉴 타이틀 검색
    console.log("클릭",event.target.textContent);
    let topic = event.target.textContent.toLowerCase();
    let url =new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=5&topic=${topic}`);
    html_AIP_search(url);
};





getLatestNew();