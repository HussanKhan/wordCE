// INJECTED TO WEBPAGE
// Only knows whats going on in webpage, restricted

console.log("CONTENT SCRIPT RUNNING");

// Extracts body of text to get paragraphs, sends to backend
const parsePage = () => {

    let content = "";
    
    const page = document.getElementsByTagName("body")[0].innerText;

    const myReg = /[A-Z].+[\.\?\!][\s]/mg;

    const matches = page.match(myReg);

    matches.forEach(para => {
        content += para;
    });

    const wordCount = content.split(" ").length;
    
    // Sends page to backend
    chrome.runtime.sendMessage({request: "newPage", wc: wordCount}, (res) => {
        return 0;
    });
};

window.onload = () => {
    parsePage();
};