function SendMessageToActiveTabContent(msg)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message" : msg});
    });
}



const btnShowPages = document.getElementById("snap-btn-show-page");
const btnExport = document.getElementById("snap-btn-export");

btnShowPages.addEventListener("click", () => {
    SendMessageToActiveTabContent({"type" : "showPagesBtnClicked"});
});


btnExport.addEventListener("click", () => {
    SendMessageToActiveTabContent({"type" : "exportBtnClicked"});
});

