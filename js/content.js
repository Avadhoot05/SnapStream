chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Message received in content script:', request.message);
    if (request["message"]) 
    {
        const message = request["message"];
        if(message["type"] === "exportBtnClicked") 
        {
            view.Export();
            return;
        }
        if(message["type"] === "showPagesBtnClicked") 
        {
            view.ShowPages();
            return;
        }

        if(message["type"] === "deleteAllClicked")
        {
            view.DeleteAll();
            return;
        }

        if(message["type"] === "getImageCount")
        {
            view.UpdatePopupState();
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
view.InsertCaptureBtn();


function CountUpdated(e)
{
    const uCount = e.detail;
    SendMessagetoPopup({"type": "CountUpdated", "uCount" : uCount}, null);
}


