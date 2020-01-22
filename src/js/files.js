import { projectFolder, keyAccessUnsplash } from './constants';
import { canvas, ctx, saveCanvas } from './canvas';

export function getBase64Image(img) {
    const canvasTemp = document.createElement("canvas");
    canvasTemp.width = img.width;
    canvasTemp.height = img.height;

    const ctxTemp = canvasTemp.getContext("2d");
    ctxTemp.drawImage(img, 0, 0);

    const dataURLTemp = canvas.toDataURL("image/png");

    return dataURLTemp.replace(/^data:image\/(png|jpg);base64,/, "");
}

export function getStartPointAndSize(img, cunvasSize) {
    let resizeWidth = img.width;
    let resizeHeight = img.height;
    let startPointX;
    let startPointY;

    if (resizeWidth >= resizeHeight) {
        resizeHeight = Math.round(resizeHeight / (resizeWidth / cunvasSize));
        startPointX = 0;
        startPointY = Math.round((cunvasSize - resizeHeight) / 2);
        resizeWidth = cunvasSize;
    } else {
        resizeWidth = Math.round(resizeWidth / (resizeHeight / cunvasSize));
        startPointX = Math.round((cunvasSize - resizeWidth) / 2);
        startPointY = 0;
        resizeHeight = cunvasSize;
    }

    const obj = {
        resizeWidth,
        resizeHeight,
        startPointX,
        startPointY
    };
    return obj;
}

export function getLinkToImage(cunvasSize = 512, town = 'London') {
    const url = `https://api.unsplash.com/photos/random?query=town,${town}&client_id=${keyAccessUnsplash}`;


    const testPeriod = false;
    const nameImage = 'test.jpg';
    const domain = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/`;
    const pathToFolderData = `${projectFolder}/assets/images/`;
    const pathToDataFile = domain + pathToFolderData + nameImage;

    try {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                localStorage.setItem('imageUrl', img.src);
                if (img.src) { img.src = localStorage.getItem('imageUrl'); }
                else {
                    img.src = data.urls.regular;
                    localStorage.setItem('imageUrl', img.src);
                }
                if (testPeriod) img.src = pathToDataFile;
                img.onload = () => {

                    const obj = getStartPointAndSize(img, cunvasSize);
                    ctx.drawImage(img, obj.startPointX, obj.startPointY, obj.resizeWidth, obj.resizeHeight);
                    // console.log('create', obj.startPointX, obj.startPointY, obj.resizeWidth, obj.resizeHeight);
                    saveCanvas();

                    const imgData = getBase64Image(img);
                    localStorage.setItem("imgData", imgData);
                    localStorage.setItem("imgDataWidth", img.width);
                    localStorage.setItem("imgDataHeight", img.height);
                }
            });
    }
    catch (err) {     
        // console.log(err);
    }

}
