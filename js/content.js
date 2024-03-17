// import { View } from "./View";
// import { PageViewFactory } from "./Factory";




const view = new View(PageViewFactory.GetPageView(location.href));
view.InsertCaptureBtn();