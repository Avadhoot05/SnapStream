// import { View } from "./View";
// import { PageViewFactory } from "./Factory";




const view = new View(PageViewFactory.GetPageView(location.href));
view.InsertCaptureBtn();



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Message received in content script:', request.message);
    if (request.message) 
    {
        
        
        const message = request.message;
        if(message.type === "exportBtnClicked") 
        {
            view.Export();
            return;
        }
        if(message.type === "exportBtnClicked") 
        {
            return;
        }


    }
  });