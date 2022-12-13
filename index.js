"use strict";


betterncm.fs.readFileText(`${this.pluginPath}/style.css`).then(cssText => {
    const style = document.createElement("style");
    style.innerHTML = cssText;
    document.head.appendChild(style);
});


async function addCover(element) {
    let data = new URLSearchParams({ c: `[{"id":${element.dataset.resId}}]` }).toString();
    const json = await (await fetch(`https://music.163.com/api/v3/song/detail?${data}`)).json();
    const qwq = element.querySelector(".title");
    const img = document.createElement("img");
    img.src = `orpheus://cache/?${json.songs[0].al.picUrl}?param=64y64`;    // 缓存
    img.classList.add("cover");
    qwq.insertBefore(img, qwq.children[0]);
}


window.addEventListener("hashchange", async event => {
    // 每日推荐
    if (event.newURL.includes("#/m/dailysong/")) {
        const result = await betterncm.utils.waitForElement(".m-daily .m-plylist");
        result.querySelectorAll(".itm").forEach(addCover);
    };

    // 听歌排行
    if (event.newURL.includes("#/m/person/record/")) {
        const result = await betterncm.utils.waitForElement(".m-recordscroll .m-plylist");
        result.querySelectorAll(".itm").forEach(addCover);
    };

    // 搜索列表
    if (event.newURL.includes("#/m/search/")) {
        const result = await betterncm.utils.waitForElement(".m-search .lst");
        new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.classList && node.classList.contains("m-plylist")) {
                        result.querySelectorAll(".itm").forEach(addCover);
                    }
                }
            }
        }).observe(result, { childList: true });
    };

    // 歌手专辑 - 以后再做
    // if (event.newURL.includes("#/m/artist/")) {
    //     const result = await betterncm.utils.waitForElement(".m-yrsh .m-mtlist .m-plylist-mix");
    //     result.querySelectorAll(".itm").forEach(addCover);
    // };

    // 歌单列表 - 有些bug，不会做了，先搁置吧。快来大佬帮帮我！
    // if (event.newURL.includes("#/m/playlist/")) {
    //     const result = await betterncm.utils.waitForElement(".m-plylist_playlist .lst");
    //     result.querySelectorAll(".itm").forEach(addCover);
    // };
});
