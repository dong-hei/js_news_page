let news=[];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button")

menus.forEach((menu) => menu.addEventListener("click", (event)=> getNewsByTopic(event)));

let searchButton = document.getElementById("basic-addon2");
let url;

//리팩토링
//각 함수에서 필요한 url을 만든다 /api호출함수를 부른다.

const getNews = async() => {
    try{
        let header = new Headers({'x-api-key':'PySkZa9mYbUVzBJ8iZszxdqzmVdEJT7oLdmgtefTnZo'})
        url.searchParams.set('page',page); //&page= 쿼리추가
        
        let response = await fetch(url,{headers:header}) // ajax, http, fetch를 이용하면 불러올수있음
        let data = await response.json() //js 시스템 특성상 response.json()을 필히 await 해줘야함}
        if(response.status == 200){
            if(data.total_hits == 0){
            throw new Error("검색된 결과값이 없습니다.")}
        news= data.articles;
        total_pages = data.total_pages;
        page = data.page;
        console.log(news);
        render();
        pagination();
    }else{
        throw new Error(data.message);}
    } catch(error){
    console.log("잡힌에러는",error.message)
    errorRender(error.message);}
};
  //에러핸들링
  //try문안에 throw new Error를 쓰면 에러를 강제로 발생시킨다

const getLatestNews = async() =>{ //async 함수와 await은 둘다 필요한다
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=5`);
    getNews();
};

const getNewsByTopic = async(event) =>{
    let topic = event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=5&topic=${topic}`);
    getNews();
}

const getNewsByKeyword = async() => {
    let keyword = document.getElementById("search-input").value;
    url = new URL(`http://api.newscatcherapi.com/https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=2`);
    getNews();
}

const render = () =>{
    let newsHTML = ''
    newsHTML = news.map(news=>{return `<div class="row news">
    <div class="col-lg-4">
      <img class="news-img-size" src="${news.media}"/>
    </div>
    <div class="col-lg-8">
      <h2>${news.title}</h2>
      <p>${news.summary}</p>
      <div>${news.rights} * ${news.published_date}</div>
    </div>
    </div>`}).join('')
    //어레이에서 스트링으로 리턴 받기위해 join
    // map(news)가 뉴스 각각의 아이템임!
    
    console.log(newsHTML)
    
    document.getElementById("news-board").innerHTML=newsHTML
    }

const errorRender = (message)  => {
        let errorHTML = `<div class="alert alert-danger text-center" role="alert">
        ${message}
      </div>`;
        document.getElementById("news-board").innerHTML = errorHTML;
}

const pagination = () => {
  let pageNationHTML = ``;
  // 총 페이지 수 

  //내가 보고있는 페이지

  //페이지 그룹 (몇번째 그룹)
  let pageGroup = Math.ceil(page/5);
  //마지막페이지
  let last = pageGroup*5

  //첫번째 페이지
  let first = last -4

  //처음과 마지막 페이지 프린트
  pageNationHTML = `  <li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
    <span aria-hidden="true">&lt;</span>
  `
  for(let i=first; i<=last; i++){
      pageNationHTML += `<li class="page-item ${page===i?"active" :""}
    "}><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>
      `
  }

  pageNationHTML+=` <li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
    <span aria-hidden="true">&gt;</span>`

  document.querySelector(".pagination").innerHTML=pageNationHTML
}

const moveToPage = (pageNum) =>{
  page =pageNum
  console.log(page)

  getNews()
}
getLatestNews();
searchButton.addEventListener("click", getNewsByKeyword)
