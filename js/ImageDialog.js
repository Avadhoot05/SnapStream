class ImageDialog
{

    constructor(arrBlob)
    {
        /**@type {HTMLElement}*/
        this.container;

        this.backDrop;

        this.arrBlobWithIds = this.CreateImageData(arrBlob);

        this.mapBlob = this.CreateImageDataMap(this.arrBlobWithIds);

        this.CreateOuterContainer();
        this.CreateHeader();
        this.CreateBody();
        this.CreateFooter();
        this.ShowHide(false);
    }


    CreateImageDataMap(arrBlobWithIds)
    {
        const mapBlob = arrBlobWithIds.reduce((acc, curr) => {
            acc.set(curr.id, curr.blob);
            return acc;
        }, new Map());

        return mapBlob;
    }

    CreateImageData(arrBlob)
    {
        const arrBlobWithIds = arrBlob.map((blob, index) => {
            return {
                blob, 
                id: index
            } 
        });

        return arrBlobWithIds;
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
        const header = document.createElement("div");
        header.className = "snap-image-dialog-header";
        header.textContent = "Captured Pages";
        this.container.appendChild(header);
    }


    CreateBody()
    {
        let body = document.createElement("div");
        body.className = "snap-image-dialog-body";
        body.addEventListener("click", this.OnImageClicked.bind(this));
        this.container.appendChild(body);


        const fragment = document.createDocumentFragment();
        for(let i = 0; i < this.arrBlobWithIds.length; i++)
        {
            fragment.appendChild(this.CreateImage(this.arrBlobWithIds[i]));
        }

        body.appendChild(fragment);
    }

    OnImageClicked(e)
    {
        e.stopPropagation();
        const id = e.target.id;

        const needle = "snap-image-dialog-img-"; 
        if(id.indexOf(needle) == -1) 
            return;

        const idx = id.indexOf(needle);
        
        const blob = this.mapBlob.get(parseInt(id.substring(idx + needle.length)));

    }

    CreateImage(blobData)
    {
        const {blob, id} = blobData;

        const imgContainer = document.createElement("div");
        imgContainer.className = "snap-image-dialog-img-container";
        
        const img = document.createElement("img");
        img.className = "snap-image-dialog-img";
        img.id = `snap-image-dialog-img-${id}`;
        img.src = URL.createObjectURL(blob);
        imgContainer.appendChild(img);
        return imgContainer;
    }

    CreateFooter()
    {
        const footer = document.createElement("div");
        footer.className = "snap-image-dialog-footer";
        this.container.appendChild(footer);

        const btnCancel = document.createElement("button");
        btnCancel.className = "snap-image-dialog-footer-btn";
        btnCancel.textContent = "Cancel";
        btnCancel.addEventListener("click", this.OnCancelClicked.bind(this));
        footer.appendChild(btnCancel);        

        const btnSave = document.createElement("button");
        btnSave.className = "snap-image-dialog-footer-btn";
        btnSave.textContent = "Save";
        btnSave.addEventListener("click", this.OnSaveClicked.bind(this));
        footer.appendChild(btnSave);   
    }


    OnSaveClicked(e)
    {

    }

    OnCancelClicked(e)
    {

    }



}