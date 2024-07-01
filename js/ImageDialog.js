class ImageDialog extends EventTarget
{
    static get EVT_SAVE_CLICKED() {
        return "EVT_SAVE_CLICKED";
    }

    constructor(arrBlob)
    {
        super();
        /**@type {HTMLElement}*/
        this.container;

        /**@type {HTMLElement}*/
        this.body;
        this.backDrop;
        this.CreateOuterContainer();
        this.CreateHeader();

        this.arrBlobWithIds = [];
        this.SetBlobs(arrBlob);

        this.draggingItem;
        this.uPointerStartX;
        this.uPointerStartY;

        this.OnDrag = this.OnDrag.bind(this);
        this.OnDragEnd = this.OnDragEnd.bind(this);

        this.CreateFooter();
        this.ShowHide(false);
        this.InitDragging();
    }

    /**
     * @param {Array} arrBlob 
     */
    SetBlobs(arrBlob)
    {
        this.arrBlobWithIds = this.CreateImageData(arrBlob);
        this.mapBlob = this.CreateImageDataMap(this.arrBlobWithIds);
        this.CreateBody();
    }

    /** 
     * @param {Arrat} arrBlobWithIds 
     * @returns {Map}
     */
    CreateImageDataMap(arrBlobWithIds)
    {
        const mapBlob = arrBlobWithIds.reduce((acc, curr) => {
            acc.set(curr.id, curr.blob);
            return acc;
        }, new Map());

        return mapBlob;
    }

    /**
     * @param {Array} arrBlob 
     * @returns {Array}
     */
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

    /**
     * @param {boolean} bShow 
     */
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

    /**
     * @param {string} strText 
     * @returns {HTMLElement}
     */
    GetLabel(strText)
    {
        const el = document.createElement("div");
        el.className = "snap-label";
        el.innerHTML = strText;
        return el;
    }

    /**
     * @param {boolean} bShow 
     */
    ShowHideNoImageLabel(bShow)
    {
        if(bShow)
        {
            this.body.classList.add("center-children");
            let noImageLabel = document.getElementById("snap-no-image-label");
            if(!noImageLabel)
            {
                noImageLabel = this.GetLabel("No captured images.");
                noImageLabel.id = "snap-no-image-label";
                this.body.appendChild(noImageLabel);
            }
            noImageLabel.classList.remove("hidden");

            const arrCls = Array.from(noImageLabel.classList);
            if(arrCls.indexOf("visible") == -1) 
                noImageLabel.classList.add("visible");

        }
        else
        {
            this.body.classList.remove("center-children");
            let noImageLabel = document.getElementById("snap-no-image-label");
            if(noImageLabel)
            {
                noImageLabel.classList.remove("visible");
                const arrCls = Array.from(noImageLabel.classList);
                if(arrCls.indexOf("hidden") == -1) 
                    noImageLabel.classList.add("hidden");
            }
        }
    }

    RemoveAllImages()
    {
        const arrImage = this.GetAllImageContainer();
        arrImage.forEach(img => img.remove());
    }

    CreateBody()
    {
        if(!this.body)
        {
            this.body = document.createElement("div");
            this.body.className = "snap-image-dialog-body";
            this.body.addEventListener("click", this.OnImageClicked.bind(this));
            this.container.appendChild(this.body);
        }

        if(this.arrBlobWithIds == 0)
        {
            this.RemoveAllImages();
            this.ShowHideNoImageLabel(true);
            return;
        }

        this.ShowHideNoImageLabel(false);
        
        
        const arrImage = this.GetAllImages();
        
        let i = 0;

        while(i < arrImage.length && i < this.arrBlobWithIds.length)
        {
            const img = arrImage[i];
            img.src = URL.createObjectURL(this.arrBlobWithIds[i].blob);
            i++;
        }

        const fragment = document.createDocumentFragment();
        while(i < this.arrBlobWithIds.length)
        {
            fragment.appendChild(this.CreateImage(this.arrBlobWithIds[i]));
            i++;
        }

        const arrImageContainer = this.GetAllImageContainer();

        while(i < arrImageContainer.length)
        {
            arrImageContainer[i].remove();
            i++;
        }

        this.body.appendChild(fragment);
    }

    /**
     * @param {Event} e 
     * @returns 
     */
    OnImageClicked(e)
    {
        e.stopPropagation();
        const id = e.target.id;
        if(this.IsDeleteIconClicked(e))
        {
            this.OnImageDelete(id);
            return;
        }

        if(this.IsDownLoadIconClicked(e))
        {
            this.OnImageDownload(id);
            return;
        }
            
        const needle = "snap-image-dialog-img-"; 
        if(id.indexOf(needle) == -1) 
            return;

        const idx = id.indexOf(needle);
        
        const blob = this.mapBlob.get(parseInt(id.substring(idx + needle.length)));

    }

    /**
     * @param {object} blobData 
     * @returns {HTMLElement}
     */
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

        const deleteIcon = this.CreateButton("delete.png"); 
        deleteIcon.className = "snap-image-dialog-img-icon snap-image-dialog-img-delete";
        deleteIcon.id = `snap-image-dialog-img-delete-${id}`;
        deleteIcon.title = "Delete image";
        imgContainer.appendChild(deleteIcon);

        const downloadIcon = this.CreateButton("download.png"); 
        downloadIcon.className = "snap-image-dialog-img-icon snap-image-dialog-img-download";
        downloadIcon.id = `snap-image-dialog-img-download-${id}`;
        downloadIcon.title = "Download image";
        imgContainer.appendChild(downloadIcon);

        return imgContainer;
    }

    /**
     * @param {string} strImageName 
     * @returns {HTMLElement}
     */
    CreateButton(strImageName)
    {
        const btn = document.createElement("button");
        btn.className = "btn snap-delete-icon";

        const img = document.createElement("img");
        img.src = chrome.runtime.getURL(`./icons/${strImageName}`);
        btn.appendChild(img);
        return btn;
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

    /**
     * @param {Event} e 
     */
    OnSaveClicked(e)
    {
        const arrBlob = this.arrBlobWithIds.map(blob => blob.blob);
        this.dispatchEvent(new CustomEvent(ImageDialog.EVT_SAVE_CLICKED, { detail: arrBlob }));
        this.ShowHide(false);
    }

    /**
     * @param {Event} e 
     */
    OnCancelClicked(e)
    {
        this.ShowHide(false);
    }

    //#region  drag and reorder

    /**
     * @param {boolean} bEnable 
     */
    EnableDisableBodyScroll(bEnable)
    {
        this.body.style.overflowY = bEnable ? "scroll" : "hidden";
    }


    /**
     * @param {boolean} bShow 
     */
    ShowHideImageButton(bShow)
    {
        const arrDeleteBtn =  this.GetAllDeleteBtn();
        arrDeleteBtn.forEach(btn => {
            btn.style.display = bShow ? "block" : "none";
        })
    }

    /**
     * @param {boolean} bShow 
     */
    ShowHideDownloadButton(bShow)
    {
        const arrDownloadBtn =  this.GetAllDownloadBtn();
        arrDownloadBtn.forEach(btn => {
            btn.style.display = bShow ? "block" : "none";
        })
    }

    InitDragging()
    {
        this.body.addEventListener('mousedown', this.OnDragStart.bind(this));
        this.body.addEventListener('touchstart', this.OnDragStart.bind(this));
    }

    /**
     * @param {Event} e 
     */
    OnDragStart(e) 
    {
        if (e.target.classList.contains('snap-image-dialog-img')) {
          this.draggingItem = e.target;
        }
      
        if (!this.draggingItem) 
            return;

        console.log("[drag] started");
      
        this.uPointerStartX = e.clientX || e.touches?.[0]?.clientX;
        this.uPointerStartY = e.clientY || e.touches?.[0]?.clientY;
      
        this.EnableDisableBodyScroll(false);
        this.ShowHideImageButton(false);
        this.ShowHideDownloadButton(false);
        this.InitDraggableItem();
        //prevRect = this.draggingItem.getBoundingClientRect();
      
        document.addEventListener('mousemove', this.OnDrag);
        document.addEventListener('touchmove', this.OnDrag, { passive: false });

        document.addEventListener('mouseup', this.OnDragEnd);
        document.addEventListener('touchend', this.OnDragEnd);
    }

    /**
     * @param {Event} e 
     */
    OnDrag(e) 
    {
        console.log("[drag] dragging");
        if (!this.draggingItem) 
            return;
      
        e.preventDefault();
        e.stopPropagation();

        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
      
        const pointerOffsetX = clientX - this.uPointerStartX;
        const pointerOffsetY = clientY - this.uPointerStartY;
      
        this.draggingItem.style.transform = `translate(${pointerOffsetX}px, ${pointerOffsetY}px)`;
        
        const idx = this.GetIndexToShowPlaceholderAfter();
        if(idx == -2)
            this.ShowHideInsertPlaceholder(false);
        else
        {
            const arrImageContainer = this.GetAllImageContainer();
            this.PositionInsertPlaceHolderAfter(arrImageContainer[idx == -1 ? 0 : idx], idx != -1);
        }
    }

    GetIndexToShowPlaceholderAfter()
    {
        const oDraggingItemRect = this.draggingItem.getBoundingClientRect();
        const arr = this.GetIntersectingImageContainer(oDraggingItemRect);
        console.log("XXX", arr[0], arr[1]);

        if(arr.length == 1 && arr[0] == 0) // ar first position
            return -1;

        return arr.length == 0 ? -2 : arr[0];  
    }

    /**
     * @param {string} prefix 
     * @param {string} id 
     * @returns {number}
     */
    GetImageIndexFromEleId(prefix, id)
    {
        const prefixIndex = id.indexOf(prefix); 
        if(prefixIndex == -1) 
            return -1;

        return parseInt(id.substring(prefixIndex + prefix.length));
    }

    Reset()
    {
        this.draggingItem.style.transform = "none";
        this.ShowHideInsertPlaceholder(false);
        this.EnableDisableBodyScroll(true);
        this.ShowHideImageButton(true);
        this.ShowHideDownloadButton(true);
        this.Cleanup();  
    }

    /**
     * @param {Event} e 
     */
    OnDragEnd(e)
    {
        document.removeEventListener('mousemove', this.OnDrag);
        document.removeEventListener('touchmove', this.OnDrag);

        document.removeEventListener('mouseup', this.OnDragEnd);
        document.removeEventListener('touchend', this.OnDragEnd);

        if(!this.draggingItem)
            return;

        console.log("[drag] end");
        

        const id =  this.draggingItem.id;
        const imageIndex = this.GetImageIndexFromEleId("snap-image-dialog-img-", id);
        if(imageIndex == -1)
        {
            this.Reset();
            return;
        }
            
        const idx = this.GetIndexToShowPlaceholderAfter();
        if(idx == -2)
        {
            this.Reset();
            return;
        }
            
            
        let blob = this.arrBlobWithIds[imageIndex];

        if(imageIndex > idx)
        {
            //delete then add     
            this.arrBlobWithIds.splice(imageIndex, 1);
            this.arrBlobWithIds.splice(idx+1, 0, blob);
        }
        else
        {
            this.arrBlobWithIds.splice(idx+1, 0, blob);
            this.arrBlobWithIds.splice(imageIndex, 1);
        }


        this.arrBlobWithIds = this.arrBlobWithIds.map((blob, index) => {
            return {
                blob : blob.blob, 
                id: index
            } 
        });

        this.mapBlob = this.CreateImageDataMap(this.arrBlobWithIds);
        this.UpdateImageIds();

        const arrImage = this.GetAllImages();
        for(let i = 0; i < arrImage.length; i++)
        {
            const img = arrImage[i];
            img.src = URL.createObjectURL(this.mapBlob.get(i));
        }

        this.Reset();  
    }

    /**
     * @param {Event} e 
     */
    IsDeleteIconClicked(e)
    {
        return e.target.classList.contains('snap-image-dialog-img-delete');
    }

    /**
     * @param {Event} e 
     */
    IsDownLoadIconClicked(e)
    {
        return e.target.classList.contains('snap-image-dialog-img-download');
    }

    /**
     * @param {string} id 
     */
    OnImageDelete(id)
    {
        const imageIndex = this.GetImageIndexFromEleId("snap-image-dialog-img-delete-", id);
        if(imageIndex == -1)
            return;

        this.arrBlobWithIds.splice(imageIndex, 1);
        this.arrBlobWithIds = this.arrBlobWithIds.map((blob, index) => {
            return {
                blob : blob.blob, 
                id: index
            } 
        });

        this.mapBlob.delete(imageIndex);

        const arrImageContainer = this.GetAllImageContainer();
        arrImageContainer[imageIndex].remove();
        this.ShowHideNoImageLabel(this.arrBlobWithIds.length == 0);
        this.UpdateImageIds();
    }

    /**
     * @param {string} id 
     */
    OnImageDownload(id)
    {
        const imageIndex = this.GetImageIndexFromEleId("snap-image-dialog-img-download-", id);
        if(imageIndex == -1)
            return;
        
        const blob = this.arrBlobWithIds[imageIndex].blob;
        
        const downloadLink = document.createElement("a");
	    downloadLink.download = `SnapStream_${Date.now()}`;
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.click();
    }

    UpdateImageIds()
    {
        const arrImage = this.GetAllImages();
        arrImage.forEach((img, idx) => {
            img.id = `snap-image-dialog-img-${idx}`;
        });

        const arrImageContainer = this.GetAllImageContainer();
        arrImageContainer.forEach((imgContainer, idx) => {
            const deleteIcon = imgContainer.getElementsByClassName("snap-image-dialog-img-delete");
            if(deleteIcon.length > 0)            
                deleteIcon[0].id = `snap-image-dialog-img-delete-${idx}`;
            
            const downloadIcon = imgContainer.getElementsByClassName("snap-image-dialog-img-download");
            if(downloadIcon.length > 0)            
                downloadIcon[0].id = `snap-image-dialog-img-download-${idx}`;
        });
    }

    CreateInsertPlaceHolder()
    {
        this.insertPlaceholder = document.createElement("div");
        this.insertPlaceholder.className = "snap-insert-placeholder hidden";
        this.body.appendChild(this.insertPlaceholder);
    }

    PositionInsertPlaceHolderAfter(node, bAfter)
    {
        if(!node)
            return;

        if(!this.insertPlaceholder)
            this.CreateInsertPlaceHolder();

        const oRect = node.getBoundingClientRect();
        const oBodyRect = this.body.getBoundingClientRect();

        this.insertPlaceholder.style.top = `${oRect.top - oBodyRect.top + 48}px`;

        if(bAfter)
            this.insertPlaceholder.style.left = `${oRect.right - oBodyRect.left}px`;
        else
            this.insertPlaceholder.style.left = `${oRect.left - oBodyRect.left - 10}px`;
        this.ShowHideInsertPlaceholder(true);
    }

    /**
     * @param {boolean} bShow 
     */
    ShowHideInsertPlaceholder(bShow)
    {
        if(!this.insertPlaceholder)
            return;

        if(bShow)
        {
            this.insertPlaceholder.classList.add("visible");
            this.insertPlaceholder.classList.remove("hidden");
        }
        else
        {
            this.insertPlaceholder.classList.remove("visible");
            this.insertPlaceholder.classList.add("hidden");
        }
    }

    /**
     * @returns {Array}
     */
    GetAllImageContainer()
    {
        return Array.from(document.getElementsByClassName("snap-image-dialog-img-container"));
    }

    /**
     * @returns {Array}
     */
    GetAllImages()
    {
        return Array.from(document.getElementsByClassName("snap-image-dialog-img"));
    }

    /**
     * @returns {Array}
     */
    GetAllDeleteBtn()
    {
        return Array.from(document.getElementsByClassName("snap-image-dialog-img-delete"));
    }

    /**
     * @returns {Array}
     */
    GetAllDownloadBtn()
    {
        return Array.from(document.getElementsByClassName("snap-image-dialog-img-download"));
    }

    /**
     * @param {object} oRect 
     */
    GetArea(oRect)
    {
        return oRect.width * oRect.height;
    }

    /**
     * @param {object} oRect1 
     * @param {object} oRect2 
     * @returns 
     */
    GetIntersectionRect(oRect1, oRect2)
    {
        let uLeft = Math.max(oRect1.left, oRect2.left);
        let uRight = Math.min(oRect1.right, oRect2.right);
        let uTop = Math.max(oRect1.top, oRect2.top);
        let uBottom = Math.min(oRect1.bottom, oRect2.bottom);  
        if(uRight <= uLeft || uBottom <= uTop)
        {
            uLeft = 0;
            uRight = 0;
            uTop = 0;
            uBottom = 0;
        }

        const oIntersectionRect = {
            top: uTop,
            bottom: uBottom,
            left: uLeft,
            right: uRight
        };

        oIntersectionRect.width = Math.abs(oIntersectionRect.right - oIntersectionRect.left);
        oIntersectionRect.height = Math.abs(oIntersectionRect.bottom - oIntersectionRect.top);
        return oIntersectionRect;
    }

    /**
     * if intersection area is 60% of container area
     * @param {object} oRect1 
     * @param {object} oRect2 
     */
    IsIntersecting(oRect1, oRect2)
    {
        const area1 = this.GetArea(oRect2);
        const area2 = this.GetArea(this.GetIntersectionRect(oRect1, oRect2));

        if(area2/area1 > 0.3)
            return true;
        return false;
    }

    /**
     * @param {object} oDraggingItemRect 
     * @returns {Array}
     */
    GetIntersectingImageContainer(oDraggingItemRect)
    {
        const arrImageContainer = this.GetAllImageContainer();
        let arr = [];
        for(let i = 0; i < arrImageContainer.length; i++)
        {
            const oContainerRect = arrImageContainer[i].getBoundingClientRect();
            if(this.IsIntersecting(oDraggingItemRect, oContainerRect))
            {
                arr.push(i); 
            }

            if(arr.length == 2)
                return arr;
        }

        return arr;
    }

    Cleanup() 
    {
        this.EnableDisableBodyScroll(true);
        console.log("[drag] clean");
        this.draggingItem = null;
        
        document.removeEventListener('mousemove', this.OnDrag);
        document.removeEventListener('touchmove', this.OnDrag);
    }

    InitDraggableItem() 
    {
        this.draggingItem.classList.remove('is-idle');
        this.draggingItem.classList.add('is-draggable');
    }
    //#endregion



    



}