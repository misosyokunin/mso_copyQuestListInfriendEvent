javascript:(()=>{
let ps = "";
const trs = document.querySelectorAll("#QuestsBlock > table > tbody > tr");
trs.forEach((tr, index) => {
	const td = tr.querySelectorAll("td");
	const text1 = (() => {
		let rs = td[1].textContent;
		rs = rs.replace(/サイズ/g, "カスタム");
		rs = rs.replace(/(レベル|NG|で|のゲームを|クリアする|のカスタムを|を稼ぐ|以上|\s|)/g, "");
		return rs;
	})();
	const ta = [];
	ta.push(index + 1);
	ta.push(td[0].textContent);
	ta.push(text1);
/*
	ta.push(td[2].textContent);
*/
	ps += `${ta.join("\t")}\n`;
});
console.log(ps);

const textarea = document.createElement("textarea");
textarea.value = ps;
textarea.style = "position: fixed; top: 0px; left: 0px; z-index: 999; right: 0px; bottom: 0px; margin: auto; height: 90%; width: 90%;";
textarea.addEventListener("click", () => {
	textarea.select();
	document.execCommand("copy");
	window.getSelection?.().removeAllRanges();
	textarea.blur();
	textarea.remove();
	
});
document.body.append(textarea);

})();
