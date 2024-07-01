const CaptureBtnFunction = Object.freeze({
    SCREENSHOT: 1, 
    EXPORT: 2
});

function SendMessageToActiveTabContent(msg)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message" : msg});
    });
}

function OnMessageRecievedFromContent(request, sender, sendResponse)
{
    console.log('Message received from content script:', request["message"]);
    if (request["message"]) 
    {
        const message = request["message"];
        if(message["type"] === "CountUpdated") 
        {
            CaptureCountUpdated(message["uCount"]);
            return;
        }
    }
}


chrome.runtime.onMessage.addListener(OnMessageRecievedFromContent);



const btnShowPages = document.getElementById("snap-btn-show-page");
const btnExport = document.getElementById("snap-btn-export");
const btnDelete = document.getElementById("snap-btn-delete");
const btnRadioScreenshot = document.getElementById("snap-screenshot");
const btnRadioExport = document.getElementById("snap-export");




btnShowPages.addEventListener("click", () => {
    SendMessageToActiveTabContent({"type" : "showPagesBtnClicked"});
});

btnExport.addEventListener("click", () => {
    SendMessageToActiveTabContent({"type" : "exportBtnClicked"});
});

btnDelete.addEventListener("click", () => {
    SendMessageToActiveTabContent({"type" : "deleteAllClicked"});
});

btnRadioExport.addEventListener("onchange", () => {
    
    let uFunction = CaptureBtnFunction.EXPORT;
    if(btnRadioScreenshot.checked)
        uFunction = CaptureBtnFunction.SCREENSHOT;

    SendMessageToActiveTabContent({"type" : "btnFunctionChanged", "uFunction": uFunction});
});

btnRadioScreenshot.addEventListener("onchange", () => {
    let bExport = btnRadioExport.checked;
    SendMessageToActiveTabContent({"type" : "btnFunctionChanged", "uFunction": uFunction});
});


function CaptureCountUpdated(uCount)
{
    if(uCount == 0)
    {
        btnExport.classList.add("disable");
        btnDelete.classList.add("disable");
    }
    else
    {
        btnExport.classList.remove("disable");
        btnDelete.classList.remove("disable");
    }
}


SendMessageToActiveTabContent({"type" : "getImageCount"});

