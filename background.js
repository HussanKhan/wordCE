// Runs as part of whole browser
// Know what has happened since user opne browser

console.log("BACKGROUND SCRIPT RUNNING");

// Current tabs
let model = {
    
    currentTab: "",
    knownTabs: {}

};

// Interacts with Popupjs and Contentjs
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
                    
                    sendResponse(1);

                case "wordCount":
                    const wc = controller.currentWordCount();

                    if (!(wc)) {
                        sendResponse({wc: 0});
                    }

                    sendResponse({wc: wc});

                default:
                    return 0
            }
        });

        chrome.browserAction.setBadgeBackgroundColor({color : "#718093"});
    }, 

    badge: (tabId) => {
        let value = controller.getWordCount(tabId);
        if (value) {
            value = value.toString();
            chrome.browserAction.setBadgeText({text: value}, (data) => {
                return 0;
            });
        }
    },
};

// Interacts with model
let controller = {
    
    updateCurrentTab: (tabId) => {
        model.currentTab = tabId;
        return 0;
    },

    addTab: (sender, request) => {
        console.log(sender)
        const tabId = sender.tab.id;
        model.knownTabs[tabId] = request.wc;
        return 0;
    },

    getWordCount: (tabId) => {
        const wordCount = model.knownTabs[tabId];
        return wordCount;
    },

    currentWordCount: () => {
        const wordCount = model.knownTabs[model.currentTab];
        return wordCount;
    }

};

view.init();