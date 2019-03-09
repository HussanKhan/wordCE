// Runs as part of whole browser
// Know what has happened since user opne browser

console.log("BACKGROUND SCRIPT RUNNING");

// Current state of badge
let model = {
    
    currentTab: "",
    knownTabs: {}

};

let view = {

    init: () => {
        
        // Update badge when focused tab changes
        chrome.tabs.onActivated.addListener((data) => {
            console.log("DETECTED TAB CHANGED");
            console.log(data);
            console.log("++++++++++++++++++++++++++++++++++++")
            controller.updateCurrentTab(data.tabId);
            view.badge(data.tabId);
        });

        // Message Router
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

            switch (request.request) {
                case "newPage":

                    controller.addTab(sender, request);

                    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                        controller.updateCurrentTab(tabs[0].id);
                        view.badge(tabs[0].id);
                    });

                    console.log(model);
                    
                    return true;

                case "pageInfo":
                    sendResponse({wc: pageObject.wordCount, title: pageObject.title});
                default:
                    return 1
            }
        });
    }, 

    badge: (tabId) => {
        let value = controller.getWordCount(tabId);
        if (value) {
            value = value.toString();
            chrome.browserAction.setBadgeText({text: value}, (data) => {
                console.log(data);
            });
        }
    },
};


let controller = {
    
    updateCurrentTab: (tabId) => {
        model.currentTab = tabId;
        return 1;
    },

    addTab: (sender, request) => {
        console.log(sender)
        const tabId = sender.tab.id;
        model.knownTabs[tabId] = request.wc;
        return 1;
    },

    getWordCount: (tabId) => {
        const wordCount = model.knownTabs[tabId];
        return wordCount;
    },

};

view.init();