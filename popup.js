

const message = {"text": "From Popup.js"};
console.log("POPUP.JS ONLINE");



document.getElementsByClassName('actionButton')[0].addEventListener("click", () => {
    const message = {message: "User Clicked Button"};
    chrome.runtime.sendMessage(message, (res) => {
        console.log("Response from backend");
    });
})