
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
        this.arrImageEle = [];

        this.imageDialog;

        window.addEventListener('beforeunload', this.OnTabClosed.bind(this), {capture: true});
        console.log("XX Unload listener attached");
    }

    OnTabClosed(e)
    {
        if(this.arrBlob.length > 0)
        {
            e.preventDefault();
            e.returnValue = 'Captured images will be lost.';
        }
            
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
        doc.addImage(image, "png", oImageRect["x"], oImageRect["y"], oImageRect["width"], oImageRect["height"], null, "SLOW");

        
        for(let i = 1; i < this.arrBlob.length; i++)
        {
            let image = new Image();
            image.src =  URL.createObjectURL(this.arrBlob[i]);
            doc.addPage([oPageSize["width"], oPageSize["height"]], "l");
            doc.addImage(image, "png", oImageRect["x"], oImageRect["y"], oImageRect["width"], oImageRect["height"], null, "SLOW");
        }
        doc.save("demo.pdf");
    }

    ShowPages()
    {
        if(!this.imageDialog)
        {
            this.imageDialog = new ImageDialog(this.arrBlob);
            this.imageDialog.addEventListener(ImageDialog.EVT_SAVE_CLICKED, this.OnImageDialogSaveClicked.bind(this));
        }
        else
        {
            this.imageDialog.SetBlobs(this.arrBlob);
        }
        
        this.imageDialog.ShowHide(true);
    }

    OnImageDialogSaveClicked(e)
    {
        this.arrBlob = e.detail;
        this.pageView.UpdateCount(this.arrBlob.length);
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
        if(uCount == 0)
        {
            this.countBubble.classList.remove("visible");
            this.countBubble.classList.add("hidden");
        }
        else
        {
            this.countBubble.innerHTML = uCount;
            this.countBubble.classList.add("visible");
            this.countBubble.classList.remove("hidden");
        }
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


class UdemyPageView extends EventTarget 
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
        this.btnScreenShot.className = "snap-yt-screenshot-btn screenshotButton udemy-button";
        this.btnScreenShot.id = "snap-screenshot-btn";
        this.btnScreenShot.innerHTML = "Capture";
        this.container.appendChild(this.btnScreenShot);
    }

    CreateCountBubble()
    {
        this.countBubble = document.createElement("span");
        this.countBubble.className = "snap-count-bubble snap-count-bubble-udemy";
        this.container.appendChild(this.countBubble);
    }

    UpdateCount(uCount)
    {
        if(!this.countBubble)
            this.CreateCountBubble();
        this.countBubble.innerHTML = uCount;
    }

    ObserveMutation()
    {
        let observer = new MutationObserver(mutations =>  
        {
            mutations.forEach(mutation => {
                if (!mutation.addedNodes) 
                    return;
                
                for (let node of mutation.target.childNodes) 
                {
                    console.log("xxxx", node.tagName);
                    if(node.tagName && node.tagName.toLowerCase() != "video")
                        continue;

                    const arrClass = node.classList;
                    if(!arrClass)
                        return;
                    console.log(arrClass);
                    for(let cls of arrClass)
                    {
                        if(cls.indexOf(elementClass.UDEMY_VIDEO_PLAYER_PREFIX) != -1)
                        {
                            observer.disconnect();
                            this.InsertCaptureBtn();
                        }
                            

                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    FindRecursive(node, classname)
    {
        if(node.className && node.className.indexOf && node.className.indexOf(classname) != -1)
            return node;
        
        let target = null;
        let children = node.children;
        if(!children)
            return target;
        children = Array.from(children);
        
        for(let child of children)
        {
            target = this.FindRecursive(child, classname);
            if(target)
                break;
        } 

        return target;
    }

    InsertCaptureBtn()
    {
        const btn = document.getElementById("snap-screenshot-btn");
        if(btn)
            return;


        this.CreateScreenshotBtn();

        /**@type {HTMLElement}*/
        const player = this.GetPlayer();
        if(!player)
        {
            this.ObserveMutation();
            return;
        }


        const section = document.getElementsByTagName("section");
        const targetClass = "volume-control--slider-"; //sound btn         
        const targetEle = this.FindRecursive(document.body, targetClass);
        
        if(targetEle && targetEle.parentElement)
        {
            // targetEle = targetEle[0];
            targetEle.parentElement.parentElement.insertBefore(this.container, targetEle.parentElement);
        }
        else
        {
            //add it as a fab btn
        }

        this.btnScreenShot.addEventListener('click', () => {

            this.CaptureScreenshotThrottled();
        });
    }

    GetPlayer()
    {
        const arrEle = document.getElementsByTagName("video");        
        let player = Array.from(arrEle).filter(ele => ele.className.indexOf(elementClass.UDEMY_VIDEO_PLAYER_PREFIX) != -1)
        return player[0];
    }
    
    CaptureScreenshot() 
    {
        const title = `screenshot${Date.now()}${this.imageFormat}`;

        const player = this.GetPlayer();
        if(!player)
            return;
        
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