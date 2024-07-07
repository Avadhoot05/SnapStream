DisposeAll();
GetUserPreferenceFromLocalStorage();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Message received in content script:', request["message"]);
    if (request["message"]) 
    {
        const message = request["message"];
        if(message["type"] === "exportBtnClicked") 
        {
            Analytics.SendEvent(AnalyticsEventId.BTN_CLICKED, AnalyticsBtnId.EXPORT);
            view.Export();
            return;
        }
        if(message["type"] === "showPagesBtnClicked") 
        {
            Analytics.SendEvent(AnalyticsEventId.BTN_CLICKED, AnalyticsBtnId.SHOW_CAPTURES);
            view.ShowPages();
            return;
        }

        if(message["type"] === "deleteAllClicked")
        {
            Analytics.SendEvent(AnalyticsEventId.BTN_CLICKED, AnalyticsBtnId.DELETE_ALL);
            view.DeleteAll();
            return;
        }

        if(message["type"] === "getImageCount")
        {
            view.UpdatePopupState();
            return;
        }

        if(message["type"] === "getUserPreference")
        {
            let data = {
                "captureBtnFunction": view.GetCaptureButtonFunction()
            };
            SendMessagetoPopup({"type": "SetUserPreference", "data" : data}, null);
            return;
        }
        
        if(message["type"] === "userPreferenceChanged")
        {
            console.log("function changed");
            let data = message["data"];
            view.SetCaptureButtonFunction(message["captureBtnFunction"]);
            SetUserPreferenceInLocalStorage(data);
            return;
        }
    }
});


function SendMessagetoPopup(message, cb)
{
    if(!cb)
        cb = (res) => {};

    chrome.runtime.sendMessage({message}, cb);
}


const view = new View(PageViewFactory.GetPageView(location.href));
view.addEventListener(View.EVT_IMAGE_COUNT_UPDATED, CountUpdated);
view.InsertScreenshotBtn();


function CountUpdated(e)
{
    const uCount = e.detail;
    SendMessagetoPopup({"type": "CountUpdated", "uCount" : uCount}, null);
}

function GetUserPreferenceFromLocalStorage()
{
    chrome.storage.local.get(["captureBtnFunction"]).then((result) => {
        console.log("Value is " + result);
        if(Object.keys(result).length != 0)
            view.SetCaptureButtonFunction(result["captureBtnFunction"]);
      });
}

/**
 * @param {object} data 
 */
function SetUserPreferenceInLocalStorage(data)
{
    chrome.storage.local.set(data).then(() => {
        console.log("Value is set", data);
      });
}



function DisposeAll()
{
    const arrCls = ["snap-screenshot-btn-container", "snap-image-dialog-container"];

    for(let cls of arrCls)
    {
        const arrEle = document.getElementsByClassName(cls);
        for(let ele of arrEle)
        {
            ele.remove();
        }
    }
}


