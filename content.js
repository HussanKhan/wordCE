// INJECTED TO WEBPAGE
// Only knows whats going on in webpage, restricted

console.log("CONTENT SCRIPT RUNNING");

// Extracts body of text to get paragraphs, sends to backend
const parsePage = () => {

    let content = "";
    
    const page = document.getElementsByTagName("body")[0].innerText;

    const myReg = /(\n|^).*?(?=\n|$)/mg;

    const matches = page.match(myReg);

    matches.forEach(para => {
        if ((para.includes(".") | para.includes("?") | para.includes("!")) && (para.split(" ").length > 5)) {
            content += para;
        }
    });
    
    const wordCount = content.split(" ").length;
    
    // Sends page to backend
    chrome.runtime.sendMessage({request: "newPage", wc: wordCount}, (res) => {
        return 0;
    });
};

window.onload = () => {
    parsePage();

    let observeThis = document.getElementsByTagName("body")[0];
    let observer = new MutationObserver(parsePage);
    const config = { attributes: false, childList: true, subtree: true};
    observer.observe(observeThis, config);
};