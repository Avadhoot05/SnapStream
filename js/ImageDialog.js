class ImageDialog
{

    constructor(arrBlob)
    {
        /**@type {HTMLElement}*/
        this.header;
        
        /**@type {HTMLElement}*/
        this.container;

        this.backDrop;

        this.arrBlob = arrBlob;

        this.CreateOuterContainer();
        this.CreateHeader();
        this.CreateBody();
        this.CreateFooter();
        this.ShowHide(false);
    }

    ShowHide(bShow)
    {
        this.container.style.display = bShow ? "block" : "none";
        this.backDrop.style.display = bShow ? "block" : "none";
    }

    CreateOuterContainer()
    {
        this.container = document.createElement("div");
        this.container.className = "snap-image-dialog-container";
        document.body.appendChild(this.container);


        this.backDrop = document.createElement("div");
        this.backDrop.className = "snap-image-dialog-backdrop";
        document.body.appendChild(this.backDrop);
    }

    CreateHeader()
    {

    }


    CreateBody()
    {
        let body = document.createElement("div");
        body.className = "snap-image-dialog-body";
        this.container.appendChild(body);


        const fragment = document.createDocumentFragment();
        for(let i = 0; i < this.arrBlob.length; i++)
        {
            const imgHolder = document.createElement("div");
            imgHolder.className = "snap-image-dialog-img-holder";
            
            const img = document.createElement("img");
            img.className = "snap-image-dialog-img";
            img.src = URL.createObjectURL(this.arrBlob[i]);
            imgHolder.appendChild(img);

            fragment.appendChild(imgHolder);
        }

        body.appendChild(fragment);
    }

    CreateFooter()
    {

    }



}