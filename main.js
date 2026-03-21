//すべての変数を登録
const apikeyget = document.querySelector('#api-key-input');
const apikeybutton = document.querySelector('#login');
const apikeyview = document.querySelector('#api_key_view');
const apikeysaveallow = document.querySelector('#apikeysaveallow');
const tomypageinfo = document.querySelector('#tomypageinfo');
const tomypage = document.querySelector('#tomypage');
const search = document.querySelector('#search');
const searchgo = document.querySelector('#searchgo');
let hash = "nanika"
const hashget = () => hash = location.hash.replace('#', '');
const apikeysaveinfo = document.querySelector('#apikeysaveinfo');
const resultsBox = document.querySelector('#kekkabox');
const gasituselect = document.querySelector("#gasitu");
//変数登録ここまで
function handleEnter(event) {
    if (event.key === 'Enter') {
        search.classList.add('active-sink');
        searchgo.classList.add('active-sink');
        setTimeout(() => {
            search.classList.remove('active-sink');
            searchgo.classList.remove('active-sink');
        }, 100);
        searchmovie();
    }
}
//動画観覧
async function movieview(movieid, img, vnm) {
    const apikey = localStorage.getItem('apikey');
    document.getElementById('mypage').style.display = 'none';
    document.getElementById('moviepage').style.display = 'block';
    document.querySelector("#movieimg").src = img;
    document.querySelector("#moviename").innerHTML = vnm;
    const requesturl = `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${movieid}`
    const options = {
        method: 'get',
        headers: {
            'x-rapidapi-key': apikey,
            'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(requesturl, options);
        const data = await response.json();
        const videoList = data.videos.items;
        videoList.forEach(video => {
            const gasituerabi = video.height + "p";
            const listvideourl = video.url;
            const hasAudio = video.hasAudio ? "あり" : "なし";
            const extension = video.extension
            gasituselect.innerHTML += `<option value="${listvideourl}">${gasituerabi}、音声${hasAudio}(${extension})</option>`;
        });
    } catch (error) {
        alert("通信エラー！なんでだろ〜なんでだろ〜");
        console.error(error)
    }
}

//初期化関数実行
hashget ();
resultsBox.innerHTML = "";
//検索プログラム
searchgo.addEventListener('click', searchmovie)
async function searchmovie() {
    const apikey = localStorage.getItem('apikey');
    const word = search.value;
    if (word === "") {
        alert("ワードを入力してください");
        return;
    };
    const requesturl = `https://youtube-media-downloader.p.rapidapi.com/v2/search/videos?keyword=${word}`;
    const options = {
        method: 'get', 
        headers: {
            'x-rapidapi-key': apikey ,
            'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(requesturl, options);
        const data = await response.json();
        resultsBox.innerHTML = "";
        data.items.forEach(video => {
            if (video.type !== 'video') return;
            const thumbnailUrl = video.thumbnails[1] ? video.thumbnails[1].url : video.thumbnails[0].url;
            const videoHTML = `
            <div class="result-card">
                <a onclick="movieview('${video.id}', '${thumbnailUrl}', '${video.title}')" style="cursor: pointer; flex-shrink: 0;">
                    <img src="${thumbnailUrl}" width="320" style="border-radius: 10px; object-fit: cover;">
                </a>
                <div>
                    <h3 style="margin: 0 0 10px 0;">
                        <a onclick="movieview('${video.id}','${thumbnailUrl}','${video.title}')" style="text-decoration: none; color: black; cursor: pointer;">
                            ${video.title}
                        </a>
                    </h3>
                    <p style="margin: 0; color: #555;">ユーザー: ${video.channel.name}</p>
                    <p style="margin: 5px 0 0 0; color: #777; font-size: 0.9em;">
                        視聴回数： ${video.viewCountText} ・ 動画の投稿日： ${video.publishedTimeText}
                    </p>
                </div>
            </div>
        `;
        resultsBox.innerHTML += videoHTML;
        });
    } catch (error) {
        alert("通信エラーです！APIキーが間違っているか、制限に引っかったかもしれません。(もし制限だったら笑えんな)");
        console.error(error)
    }
};
//api-keyのセーブ許可ボタンのイベントキャッチ
apikeysaveallow.addEventListener('click', () => {
    localStorage.setItem('apikey', hash);
    if (localStorage.getItem('apikey') === hash) {
        console.log("hashの保存完了！");
        apikeyview.innerHTML = '';
        apikeysaveallow.style.display = 'none';
        apikeysaveinfo.outerHTML = '<h3>API-KEYの保存に成功しました！リロードしてください！<h3>';
    } else {
        apikeyview.innerHTML = hash;
        apikeysaveallow.style.display = 'none';
        apikeysaveinfo.innerHTML = `API-KEYの保存に失敗しました。結果:${localStorage.getItem('apikey')}`;
    }
});
//tomypageinfoのボタンイベントをキャッチ
tomypageinfo.addEventListener('click', () =>{
    window.location.hash = "mypage";
})
//api-keyボタンをキャッチ
apikeybutton.addEventListener('click', () => {
    if (apikeyget.value === "") {
        alert("apikeyを入力してください");
        return;
    }
    const isYes = confirm(`${apikeyget.value}\n↑こちらのAPIキーでログインしますか？\n（次回開くときはブラウザーにデータが保存されるため、再入力は不要です。）`);
    if(isYes) window.location.hash = apikeyget.value;
    hashget ();
});
//ページの切り替え関数をアロー関数で定義
const pagechenge = () => {
    hashget ();
    const apikeysaved = localStorage.getItem('apikey') 
    if (hash === ""){
        if (apikeysaved === null) {
            document.getElementById('login_page').style.display = 'block';
            document.getElementById('apikey_save').style.display = 'none';
            document.getElementById('mypage').style.display = 'none';
            document.getElementById('tomypageinfo').style.display = 'none';
        } else {
            document.getElementById('login_page').style.display = 'none';
            document.getElementById('apikey_save').style.display = 'none';
            document.getElementById('mypage').style.display = 'none';
            document.getElementById('tomypageinfo').style.display = 'block';
        }
    } else if (hash === "mypage"){
       if (apikeysaved === null) {
            document.getElementById('login_page').style.display = 'none';
            document.getElementById('apikey_save').style.display = 'none';
            document.getElementById('mypage').style.display = 'none';
            document.getElementById('tomypageinfo').style.display = 'none';
           alert('API_KEYが設定されていないのにマイページを開こうとしたため、最初の画面に戻します。')
           window.location.hash = "";
        } else {
            document.getElementById('login_page').style.display = 'none';
            document.getElementById('apikey_save').style.display = 'none';
            document.getElementById('mypage').style.display = 'block';
            document.getElementById('tomypageinfo').style.display = 'none';
        }
    } else {
       if (apikeysaved === null) {
            document.getElementById('login_page').style.display = 'none';
            document.getElementById('apikey_save').style.display = 'block';
            document.getElementById('mypage').style.display = 'none';
            document.getElementById('tomypageinfo').style.display = 'none';
            apikeyview.innerHTML = hash
        } else {
            document.getElementById('login_page').style.display = 'none';
            document.getElementById('apikey_save').style.display = 'none';
            document.getElementById('mypage').style.display = 'none';
            document.getElementById('tomypageinfo').style.display = 'block';
        }
    };
};
//ページのリセット
pagechenge ();
//　ハッシュの変更を検知して、任意のプログラムを実行
window.addEventListener('hashchange',pagechenge); 
