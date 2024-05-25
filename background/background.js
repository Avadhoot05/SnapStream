chrome.runtime.onInstalled.addListener(async () => 
{
    for (const cs of chrome.runtime.getManifest().content_scripts) 
    {
        for (const tab of await chrome.tabs.query({url: cs.matches})) 
        {   
            if (tab.url.match(/(chrome|chrome-extension):\/\//gi)) 
                continue;
        
            chrome.scripting.executeScript({
                files: cs.js,
                target: {tabId: tab.id, allFrames: cs.all_frames},
                injectImmediately: cs.run_at === 'document_start',
                // world: cs.world, // uncomment if you use it in manifest.json in Chrome 111+
            });
      }
    }
  });

//   chrome.tabs.onUpdated.addListener(
//     function(tabId, changeInfo, tab) {
//       // read changeInfo data and do something with it
//       // like send the new url to contentscripts.js
//       if (changeInfo.url) {
        
//       }
//     }
//   );



//   function SendMessageToTab(tabId, msg)
//   {
//     chrome.tabs.sendMessage( tabId, {
//         message: "UrlChanged",
//         url: changeInfo.url
//       })
//   }