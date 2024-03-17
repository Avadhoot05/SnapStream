
var viewObj;
class View
{
    constructor(pageView)
    {
        if(viewObj)
        {
            throw new Error("View is already instantiated");
        }
        viewObj = this;
        
        this.pageView = pageView;
    }

    InsertCaptureBtn()
    {
        this.pageView.InsertCaptureBtn();
    }
}


class YTPageView
{
    constructor()
    {

    }

    InsertCaptureBtn()
    {
        document.body.appendChild(button);

        button.addEventListener('click', () => {
           alert('Button clicked!');
        });
    }
}