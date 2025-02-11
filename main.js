javascript:(async()=>{
"use strict";

/*＝＝＝＝＝＝＝＝＝＝【スクリプト実行確認】＝＝＝＝＝＝＝＝＝＝*/

/*
https://minesweeper.online/ja/arenas
*/


/*＝＝＝＝＝＝＝＝＝＝【スクリプト実行前定数セット】＝＝＝＝＝＝＝＝＝＝*/

const LIMIT_DAY = "01月 04日";	/*★取得する最後の日付（というよりも最初の日付）*/
/*
L8は
"01月 05日"
にする！
*/

const Wait = {
	waits : [],
	num : -1,
	add(){
		return new Promise((resolve) =>{
			this.num++;
			this.waits[this.num] = resolve;
		});
	},
	release(){
		this.waits[this.num]();
		this.waits[this.num] = "";
		this.num--;
	},
	time(sec){
		return new Promise((resolve) =>{
			setTimeout(function(){resolve();}, sec * 1000);
		});
	},
};


/*＝＝＝＝＝＝＝＝＝＝【実行前ユーザー入力】＝＝＝＝＝＝＝＝＝＝*/
const SCRIPT_STYLE = document.createElement("style");
SCRIPT_STYLE.innerHTML = `
#___________bk{
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	margin: 0px auto;
	background-color: rgba(0, 0, 0, 0.5);
	width: 100vw;
	font-size: 3ch;
	z-index: 100;
	display: flex;
	height: 100vh;
	padding: 1em;
	justify-content: end;
}
#___________bk progress{
	width: 100%;
}
#____StartDIV{
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
}
#_____Poo{
	display: none;
}
#____EndDIV{
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
}
#____EndDIV > textarea{
	height: 50%;
	font-size: 16px;
	field-sizing: content;
}
#____EndDIV > section{
	height: 20%;
	font-size: 16px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows:
	repeat(2, 1fr); gap: 0px;
}
.hiddenContent{
	display: none !important;
}
`;

const bk = document.createElement("div");
bk.id = "___________bk";
bk.append(SCRIPT_STYLE);
{
	const article = document.createElement("article");
	article.id = "____StartDIV";
	bk.append(article);
	{
		const p = document.createElement("p");
		p.textContent = "データ取得中…";
		article.append(p);
	}
	{
		const button = document.createElement("button");
		button.type = "button";
		button.textContent = "終了する";
		button.addEventListener("click", () => {
			isLooping = false;
		});
		article.append(button);
	}
	{
		const progress = document.createElement("progress");
		progress.id = "____progress";
		progress.max = 0;
		progress.value = 0;
		article.append(progress);
	}
}


const poo = document.createElement("div");
poo.id = "_____Poo";
bk.append(poo);

document.body.append(bk);

/*＝＝＝＝＝＝＝＝＝＝【実行前定数セット】＝＝＝＝＝＝＝＝＝＝*/



/*＝＝＝＝＝＝＝＝＝＝【実行中ユーザー入力】＝＝＝＝＝＝＝＝＝＝*/


/*＝＝＝＝＝＝＝＝＝＝【データ取得】＝＝＝＝＝＝＝＝＝＝*/
const MyDate = new class{
	/*
	const poo = [
		"今日, 15:03:19",
		"01月 16日, 02:25:24",
		"2024年 01月 08日, 19:34:15",
	];
	poo.forEach((str) => {
		const rs = MyDate.format(str);
		const rn = MyDate.encode(rs);
		const rss = MyDate.decode(rn);
		const rsss = MyDate.getDateMinuteString(rss);
		console.log(rs, rn, rss, rsss);
	});
	*/
	/*
	2025-01-29:15:03:19 1738130599000 Wed Jan 29 2025 15:03:19 GMT+0900 (日本標準時) 2025-01-29:15:03
	2025-01-16:02:25:24 1736961924000 Thu Jan 16 2025 02:25:24 GMT+0900 (日本標準時) 2025-01-16:02:25
	2024-01-08:19:34:15 1704710055000 Mon Jan 08 2024 19:34:15 GMT+0900 (日本標準時) 2024-01-08:19:34
	*/
	constructor(){
		this.today = new Date();
		this.year = this.today.getFullYear();
		this.todayStr = this.getDateString(this.today);
	}
	encode(str){
		return Date.parse(str);
	}
	decode(num){
		return new Date(num);
	}
	format(str){
		let rs = str;
		rs = rs.replace("今日", this.todayStr);
		if(rs.match(/^\d\d\d\d/)){
		
		}else{
			rs = `${this.year}年${rs}`;
		}
		rs = rs.replace(/[\s|日]/g, "");
		rs = rs.replace(/[年|月]/g, "-");
		rs = rs.replace(/[,]/g, ":");
		return rs;
	}
	getDateParts(date){
		const ro = {
			"YYYY": date.getFullYear().toString().padStart(4, '0'),
			"MM": (date.getMonth() + 1).toString().padStart(2, '0'),
			"DD": date.getDate().toString().padStart(2, '0'),
			"HH": date.getHours().toString().padStart(2, '0'),
			"mm": date.getMinutes().toString().padStart(2, '0'),
		};
	  return ro;
	}
	getDateString(date){
		const rp = this.getDateParts(date);
		return `${rp["YYYY"]}-${rp["MM"]}-${rp["DD"]}`;
	}
	getDateMinuteString(date){
		const rp = this.getDateParts(date);
		return `${rp["YYYY"]}-${rp["MM"]}-${rp["DD"]}:${rp["HH"]}:${rp["mm"]}`;
	}
};



const ARENA_LIMIT_MINUTES = {
	"L1": 15,
	"L2": 20,
	"L3": 30,
	"L4": 40,
	"L5": 50,
	"L6": 60,
	"L7": 75,
	"L8": 90,
};
for(const [key, value] of Object.entries(ARENA_LIMIT_MINUTES)){
	ARENA_LIMIT_MINUTES[`${key}E`] = value * 2;
}
for(const [key, value] of Object.entries(ARENA_LIMIT_MINUTES)){
	ARENA_LIMIT_MINUTES[key] = `00:${value}:00`;
}

const putDatas = {};

let isLooping = true;
let progress;
/*アリーナのリンクを取得する*/
{
	let isTwice = false;
	const target = document.body;
	const observer = new MutationObserver(async function (mutations) {
		const tar = mutations[0].target;
/*
		console.log(tar);
*/
		if(tar.id === "stat_pagination"){	/*ページ遷移*/
			if(!isTwice){	/*ページ遷移の瞬間とページ遷移後の2回ヒットする。遷移後だけに処理したい*/
				isTwice = true;
				return;
			}
			isTwice = false;
			Wait.release();
		}
	});
	observer.observe(target, {
		characterData: true,	/*テキストノードの変化を監視*/
		childList: true,	/*子ノードの変化を監視*/
		subtree: true,	/*子孫ノードも監視対象に含める*/
	});
	
	/*1ページ目から始める*/
	if(document.querySelector("#stat_pagination > .first")){
		if(document.querySelector("#stat_pagination > .first").classList.contains("disabled")){
			
		}else{
			isTwice = true;
			document.querySelector("#stat_pagination > .first > a").click();
			await Wait.add();
		}
	}
	
	let func = null;
	let isLimit = false;
	loop1: while(isLooping){
		const trs = document.querySelectorAll("#stat_table_body > tr");
		for(let i = 0; i < trs.length; i++){
			const tr = trs[i];
			const tds = tr.querySelectorAll("td");
			if(tds[1].textContent === " "){	/*謎のスペース*/
				break loop1;
			}
			if(tds[6].textContent.startsWith(LIMIT_DAY)){
				if(isLimit){
				
				}else{
					isLimit = true;
					func = function(tds){
						return !tds[6].textContent.startsWith(LIMIT_DAY);
					};
				}
			}
			if(func?.(tds)){
				break loop1;
			}
/*
			if(!tds[2].textContent.match(/アリーナ/)){
				continue;
			}
*/
			if(tds[3].querySelector("span").dataset.originalTitle === "進行中"){
				continue;
			}
			
			const link = tds[0].querySelector("a");
			poo.append(link);
			const to = {};
			to["player"] = "あ";
			to["mode"] = "あ";
			to["startTime"] = MyDate.encode(MyDate.format(tds[6].textContent));
			to["endTime"] = "あ";
			to["theme"] = "0";	/*選択テーマ　"0":不明　"1":ランダム　"2":クラシック*/
			to["progress"] = (() => {
				if(tds[3].querySelector("span").dataset.originalTitle === "クリア"){
					return "1";	/*成功*/
				}
				if(tds[3].querySelector("span").dataset.originalTitle === "エラー"){
					return "4";	/*エラー*/
				}
				if(tds[5].textContent === "期限切れ"){
					return "2";	/*失敗*/
				}else{
					return "3";	/*中断*/
				}
			})();
			to["details"] = "あ";
			putDatas[link.textContent] = to;
			
		}
		await Wait.time(1);
		const next = document.querySelector("#stat_pagination > .next");
		if(!next){
			break;
		}
		if(next.classList.contains("disabled")){
			break;
		}
		next.click();
		await Wait.add();
	}
	observer.disconnect();
}


{
	/*アリーナリンクをクリックしていく*/
	const target = document.body;
	const observer = new MutationObserver(async function (mutations) {
		const tar = mutations[0].target;
	/*
		console.log(tar);
	*/
		if(tar.id === "ArenaDetailBlock"){	/*アリーナ詳細表示*/
			Wait.release();
		}
	});
	observer.observe(target, {
		characterData: true,	/*テキストノードの変化を監視*/
		childList: true,	/*子ノードの変化を監視*/
		subtree: true,	/*子孫ノードも監視対象に含める*/
	});
	
	const links = poo.querySelectorAll("a");
	progress = document.getElementById("____progress");
	progress.max = links.length;
	for(let i = 0; i < links.length; i++){
		const link = links[i];
		link.click();
		await Wait.add();
		const trs = document.querySelectorAll("#ArenaDetailBlock > .series-table > tbody > tr");
		const to = putDatas[location.href.replace(/.+\//, "")];
		to["player"] = trs[0].querySelector("a").href.replace(/^.+\//, "");
		to["mode"] = trs[1].querySelector("td:nth-of-type(2) > span").textContent.replace(/^\s/, "");
		to["details"] = trs[1].querySelector("td:nth-of-type(2) > div").textContent;
/*
		to["startTime"] = document.querySelectorAll("#stat_table_body > tr")[0].querySelectorAll("td")[6].textContent;
*/
		to["endTime"] = (()=>{
			/*実質的な終了時間を求める。*/
			/*
				成功：開始時間＋経過時間（※ペナルティは含まないことに注意）
				失敗：開始時間＋制限時間－ペナルティ
				中断：開始時間＋経過時間
				エラー：開始時間（※詳細がわからないhttps://minesweeper.online/ja/arena/1788901）
			*/
			let addTime = "00:00:00";
			let subtractTime = "00:00:00";
			if(to["progress"] === "1"){
				addTime = trs[2].querySelector("td:nth-of-type(2) > span").textContent;
 			}
			if(to["progress"] === "2"){
				addTime = ARENA_LIMIT_MINUTES[to["mode"].replace(/^.+\s/, "")];
				if(trs[3].querySelector("td:nth-of-type(1)").textContent === "ペナルティ："){
					subtractTime = trs[3].querySelector("td:nth-of-type(2) > span").textContent;
				}
			}
			if(to["progress"] === "3"){
				addTime = trs[2].querySelector("td:nth-of-type(2) > span").textContent;
			}
			if(to["progress"] === "4"){
			}
			
			const endTime = MyDate.decode(to["startTime"]);
			let [hh, mm, ss] = addTime.split(":");
			endTime.setHours(endTime.getHours() + Number(hh));
			endTime.setMinutes(endTime.getMinutes() + Number(mm));
			endTime.setSeconds(endTime.getSeconds() + Number(ss));
			[hh, mm, ss] = subtractTime.split(":");
			endTime.setHours(endTime.getHours() - Number(hh));
			endTime.setMinutes(endTime.getMinutes() - Number(mm));
			endTime.setSeconds(endTime.getSeconds() - Number(ss));
			return MyDate.encode(endTime);
		})();
/*
		to["theme"] = "0";
		to["progress"] = "成功";
*/
		progress.value++;
		await Wait.time(1);
	}
	
	observer.disconnect();
}




/*＝＝＝＝＝＝＝＝＝＝【データ表示】＝＝＝＝＝＝＝＝＝＝*/


document.getElementById("____StartDIV").classList.add("hiddenContent");
{
	const article = document.createElement("article");
	article.id = "____EndDIV";
	{
		const textarea = document.createElement("textarea");
		textarea.value = JSON.stringify(putDatas, null, "\t");
		article.append(textarea);
		
		const section = document.createElement("section");
		article.append(section);
		{
			const button = document.createElement("button");
			button.type = "button";
			button.textContent = "📃コピーする";
			button.addEventListener("click", () => {
				textarea.select();
				document.execCommand("copy");
				window.getSelection?.().removeAllRanges();
				textarea.blur();
				button.textContent = "📃コピーしました！";
				setTimeout(() => {
					button.textContent = "📃コピーする";
				}, 3000);
			});
			button.style = "grid-column: span 2 / span 2;";
			section.append(button);
		}
		{
			const button = document.createElement("button");
			button.type = "button";
			button.textContent = "閉じる";
			button.addEventListener("click", () => {
				bk.remove();
				location.href = "https://minesweeper.online/ja/arenas";
			});
			button.style = "grid-column-start: 1; grid-row-start: 2;";
			section.append(button);
		}
		{
			const button = document.createElement("button");
			button.type = "button";
			button.textContent = "";
			button.style = "grid-column-start: 2; grid-row-start: 2;";
			section.append(button);
		}
	}
	bk.append(article);
}


/*＝＝＝＝＝＝＝＝＝＝【終了処理】＝＝＝＝＝＝＝＝＝＝*/

})();
