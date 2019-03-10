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
            controller.updateCurrentTab(data.tabId);
            view.badge();
        });

        // Message Router
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

            switch (request.request) {
                case "newPage":

                    controller.addTab(sender, request);

                    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                        controller.updateCurrentTab(tabs[0].id);
                        view.badge();
                    });
                    
                    sendResponse(1);

                    console.log(model);

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

    // Updates badge
    badge: () => {
        const value = controller.currentWordCount();
        if (value) {
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
        const tabId = sender.tab.id;
        model.knownTabs[tabId] = request.wc;
        return 0;
    },

    currentWordCount: () => {
        let wordCount = model.knownTabs[model.currentTab];

        if (!(wordCount)) {
            return 0;
        }

        wordCount = wordCount.toString()
        return wordCount;
    }

};

view.init();