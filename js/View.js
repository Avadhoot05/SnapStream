
var viewObj;
class View
{
    static get EVT_IMAGE_CAPTURED() {
        return "EVT_IMAGE_CAPTURED";
    }
    constructor(pageView)
    {
        if(viewObj)
        {
            throw new Error("View is already instantiated");
        }
        viewObj = this;
        
        this.pageView = pageView;
        this.pageView.addEventListener(View.EVT_IMAGE_CAPTURED, this.OnImageCaptured.bind(this));

        this.arrBlob = [];

        
    }

    InsertCaptureBtn()
    {
        this.pageView.InsertCaptureBtn();
    }

    OnImageCaptured(e)
    {
        console.log("Event recieved");
        console.log(e);
        this.arrBlob.push(e.detail);
        this.GeneratePDF();
    }

    GeneratePDF()
    {
        if(this.arrBlob.length < 2)
            return;

        const oPageSize = this.pageView.GetPageSize();

        const {jsPDF} = jspdf;
        const doc = new jsPDF({
            "orientation": "l",
            "format" : [oPageSize["width"], oPageSize["height"]],
            "unit" : "pt"
        });

        const oImageRect = this.pageView.GetImageRect();

        //add watermark on first page

        for(let i = 0; i < this.arrBlob.length; i++)
        {
            const image = new Image();
            image.src =  URL.createObjectURL(this.arrBlob[i]);
            
            doc.addPage([oPageSize["width"], oPageSize["height"]], "l");
            doc.addImage(image, "png", oImageRect["x"], oImageRect["y"], oImageRect["width"], oImageRect["height"], "Demo", "SLOW");
        }
        
        

        doc.save("demo.pdf");
    }
}


class YTPageView extends EventTarget
{
    constructor()
    {
        super();
        this.btnScreenShot;
        this.imageFormat = ".png";
        this.CaptureScreenshotThrottled = GetThrottleFunction(this.CaptureScreenshot.bind(this), 200); 

        this.uTopSpacing = 5;
        this.uHorizontalSpacing = 5;

        //a4 landscape
        this.uPageWidth = 842;
        this.uPageHeight = 595;
    }

    GetPageSize()
    {
        return {
            "width" : this.uPageWidth, 
            "height": this.uPageHeight
        }
    }

    GetImageRect()
    {
        return {
            "x": this.uTopSpacing,
            "y": this.uHorizontalSpacing,
            "width" : this.uPageWidth - 2 * this.uHorizontalSpacing,
            "height" : Math.floor(this.uPageWidth * 9 /16) //since YT player mostly is 16:9 
        }
    }

    CreateScreenshotBtn()
    {
        this.btnScreenShot = document.createElement("button");
        this.btnScreenShot.className = "screenshotButton ytp-button";
        this.btnScreenShot.style.width = "auto";
        this.btnScreenShot.innerHTML = "Screenshot";
        this.btnScreenShot.style.cssFloat = "left";
    }

    InsertCaptureBtn()
    {
        this.CreateScreenshotBtn();
        
        const bottomControls = document.getElementsByClassName("ytp-right-controls")[0];
        if (bottomControls) 
        {
            bottomControls.prepend(this.btnScreenShot);
        }
        else
        {
            //add it as a fab btn
        }

        this.btnScreenShot.addEventListener('click', () => {

            this.CaptureScreenshotThrottled();
        });
    }

    CaptureScreenshot() 
    {

        const title = `screenshot${Date.now()}${this.imageFormat}`;
    
        const player = document.getElementsByClassName(elementClass.YOUTUBE_VIDEO_PLAYER)[0];
    
        const canvas = document.createElement("canvas");
        canvas.width = player.videoWidth;
        canvas.height = player.videoHeight;
        canvas.getContext('2d').drawImage(player, 0, 0, canvas.width, canvas.height);
    
        const downloadLink = document.createElement("a");
        downloadLink.download = title;
    
        
        function DownloadBlob(blob) {
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.click();
        }
        
    
        
    
        canvas.toBlob(async (blob) => {
            this.dispatchEvent(new CustomEvent(View.EVT_IMAGE_CAPTURED, {detail: blob})); 
            
            //DownloadBlob(blob);
        }, 'image/' + this.imageFormat);
        
    }
}