
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

        this.imageDialog;
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
        this.pageView.UpdateCount(this.arrBlob.length);
    }

    Export()
    {
        if(this.arrBlob.length == 0)
            return;

        const oPageSize = this.pageView.GetPageSize();

        const {jsPDF} = jspdf;
        const doc = new jsPDF({
            "orientation": "l",
            "format" : [oPageSize["width"], oPageSize["height"]],
            "unit" : "pt"
        });

        const oImageRect = this.pageView.GetImageRect();

        let image = new Image();
        image.src =  URL.createObjectURL(this.arrBlob[0]);
        doc.addImage(image, "png", oImageRect["x"], oImageRect["y"], oImageRect["width"], oImageRect["height"], "Demo", "SLOW");


        for(let i = 1; i < this.arrBlob.length; i++)
        {
            image = new Image();
            image.src =  URL.createObjectURL(this.arrBlob[i]);
            
            doc.addPage([oPageSize["width"], oPageSize["height"]], "l");
            doc.addImage(image, "png", oImageRect["x"], oImageRect["y"], oImageRect["width"], oImageRect["height"], "Demo", "SLOW");
        }
        
        doc.save("demo.pdf");
    }



    ShowPages()
    {
        this.imageDialog = new ImageDialog();
    }
}


class YTPageView extends EventTarget
{
    constructor()
    {
        super();
        this.btnScreenShot;
        this.countBubble;
        this.container;

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

        this.container = document.createElement("div");
        this.container.className = "snap-screenshot-btn-container"

        this.btnScreenShot = document.createElement("button");
        this.btnScreenShot.className = "snap-yt-screenshot-btn screenshotButton ytp-button";
        this.btnScreenShot.innerHTML = "Capture";
        this.container.appendChild(this.btnScreenShot);
    }

    CreateCountBubble()
    {
        this.countBubble = document.createElement("span");
        this.countBubble.className = "snap-count-bubble";
        this.container.appendChild(this.countBubble);
    }

    UpdateCount(uCount)
    {
        if(!this.countBubble)
            this.CreateCountBubble();
        this.countBubble.innerHTML = uCount;
    }



    InsertCaptureBtn()
    {
        this.CreateScreenshotBtn();
        
        
        const bottomControls = document.getElementsByClassName("ytp-right-controls")[0];
        if (bottomControls) 
        {
            bottomControls.prepend(this.container);
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