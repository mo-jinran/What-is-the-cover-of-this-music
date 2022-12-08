"use strict";


async function addCover(element) {
    let data = new URLSearchParams({ c: `[{"id":${element.dataset.resId}}]` }).toString();
    const json = await (await fetch(`https://music.163.com/api/v3/song/detail?${data}`)).json();
    const qwq = element.querySelector(".title");
    const img = document.createElement("img");
    img.src = `orpheus://cache/?${json.songs[0].al.picUrl}?param=64y64`;    // 缓存
    img.classList.add("cover");
    qwq.insertBefore(img, qwq.children[0]);
}


plugin.onLoad(() => {
    window.addEventListener("hashchange", async event => {
        // 每日推荐
        if (event.newURL.includes("#/m/dailysong/")) {
            const result = await betterncm.utils.waitForElement(".m-daily .m-plylist-daily .bd");
            result.querySelectorAll(".itm").forEach(addCover);
        };
        // 听歌排行
        if (event.newURL.includes("#/m/person/record/")) {
            const result = await betterncm.utils.waitForElement(".m-recordscroll .m-plylist-recent");
            result.querySelectorAll(".itm").forEach(addCover);
        };
        // 搜索列表 - 只能展现第一页，后面不能添加封面，暂时搁置
        // if (event.newURL.includes("#/m/search/")) {
        //     const result = await betterncm.utils.waitForElement(".m-search .m-plylist-lrc");
        //     result.querySelectorAll(".itm").forEach(addCover);
        // };
        // 歌单列表 - 有些bug，不会做了，先搁置吧。快来大佬帮帮我！
        // if (event.newURL.includes("#/m/playlist/")) {
        //     const result = await betterncm.utils.waitForElement(".m-plylist_playlist .lst");
        //     result.querySelectorAll(".itm").forEach(addCover);
        // };
    });
});


plugin.onAllPluginsLoaded(plugins => plugins.StylesheetLoader.loadStylesheet(
    plugin,
    `${this.pluginPath}/style.css`,
    "What's the cover of this music",
    {}
));
