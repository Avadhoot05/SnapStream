class ImageDialog
{

    constructor()
    {
        /**@type {HTMLElement}*/
        this.header;
        
        /**@type {HTMLElement}*/
        this.container;

        this.backDrop;
        this.CreateOuterContainer();
        this.CreateHeader();
        this.CreateFooter();
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

    CreateFooter()
    {

    }



}