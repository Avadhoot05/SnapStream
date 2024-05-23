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
        if(strUrl.indexOf(ViewUrl.UDEMY) != -1)
        {
            console.log("Udemy detected");
            return new UdemyPageView();
        }
        return null;
    }
}