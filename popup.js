const message = {"text": "From Popup.js"};
console.log("POPUP.JS ONLINE");

chrome.runtime.sendMessage({request: "wordCount"}, (res) => {
    document.getElementsByClassName("wordCount")[0].innerText = res.wc;
});