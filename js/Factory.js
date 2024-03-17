// import { YTPageView } from "./View";

class PageViewFactory
{
    /**
     * @param {string} strUrl 
     */
    static GetPageView(strUrl)
    {
        if(strUrl.indexOf(ViewUrl.YOUTUBE) != -1)
        {
            console.log("YT detected");
            return new YTPageView();
        }
        return null;
    }
}