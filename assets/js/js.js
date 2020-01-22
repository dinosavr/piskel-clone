const projectFolder = 'codejam-image-api';
const keyAccessUnsplash = '507aee803d5a35c77ef11a924ce9d04d9041aaf25398cd6643ef145f8f35f496';
// const testImageUrl = 'https://img.tripmapia.ru/hotels/14/7/5/1c61caff-0968-c0bf-27bd-8c29a8a21a20.jpg';
const toolPencil = document.getElementById('toolPencil');
const toolFill = document.getElementById('toolFill');
const toolDropper = document.getElementById('toolDropper');
const showCurrentColor = document.getElementById('showCurrentColor');
const currentColorSelector = document.getElementById('currentColorSelector');
const showPrevColor = document.getElementById('showPrevColor');
const main = document.getElementById('main');
const btnMenu = document.getElementById('btnMenu');
const btnMenuSetting = document.getElementById('btnMenuSetting');
const toolClear = document.getElementById('toolClear');
const currentColorElement = document.getElementById('currentColor');
const prevColorElement = document.getElementById('prevColor');
const colorRedElement = document.getElementById('colorRed');
const colorBlueElement = document.getElementById('colorBlue');
const field4x4 = document.getElementById('field4x4');
const field16x16 = document.getElementById('field16x16');
const field32x32 = document.getElementById('field32x32');
const field64x64 = document.getElementById('field64x64');
const field128x128 = document.getElementById('field128x128');
const toolGrayscale = document.getElementById('toolGrayscale');
const loadTownBtn = document.getElementById('loadTownBtn');
const nameTown = document.getElementById('nameTown');
const townError = document.getElementById('townError');
const currentSize = document.getElementById('currentSize');
const rangeSize = document.getElementById('rangeSize');

const canvas = document.querySelector('canvas');
const canvasSizeArea = 512;
const minPowerCanvas = 5;
const ctx = canvas.getContext('2d');
canvas.area = canvasSizeArea;
canvas.width = localStorage.getItem('currentWidth') ? localStorage.getItem('currentWidth') : canvasSizeArea;
canvas.height = localStorage.getItem('currentHeight') ? localStorage.getItem('currentHeight') : canvasSizeArea;

function init() {
    const currentAction = localStorage.getItem('currentAction');
    toolPencil.click();
    if (currentAction) {
        document.getElementById(currentAction).classList.add('active');
        const pathToCursorFolder = 'assets/icons/';
        canvas.style.cursor = `url("${pathToCursorFolder}cursor-${currentAction}.png") 0 32, auto`;
    } else toolPencil.click();

    const currentColor = localStorage.getItem('currentColor');
    if (currentColor) { showCurrentColor.style.background = currentColor; } else {
        showCurrentColor.style.background = 'rgb(255, 193, 7)';
        currentColorSelector.setAttribute('value', '#ffc107');
        localStorage.setItem('currentColor', 'rgb(255, 193, 7)');
    }
    const prevColor = localStorage.getItem('prevColor');
    if (prevColor) { showPrevColor.style.background = prevColor; } else {
        showPrevColor.style.background = 'rgb(65, 247, 149)';
        localStorage.setItem('prevColor', 'rgb(65, 247, 149)');
    }

    const dataURL = localStorage.getItem('canvasSave');
    if (dataURL) {
        const img = new Image();
        img.src = dataURL;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
    }

    currentSize.innerHTML = `${canvas.width}x${canvas.height}`;
    rangeSize.value = Math.log2(canvas.width) - minPowerCanvas;
}

function createCanvasArea(elementSize) {
    localStorage.setItem('currentElementSize', elementSize);
    const scale = 1;// const scale = canvasSizeArea / elementSize;
    localStorage.setItem('currentScale', scale);

    canvas.width = elementSize;
    canvas.height = elementSize;
    localStorage.setItem('currentWidth', canvas.width);
    localStorage.setItem('currentHeight', canvas.height);

    ctx.clearRect(0, 0, canvasSizeArea, canvasSizeArea);

    for (let row = 0; row < elementSize; row += 1) {
        for (let col = 0; col < elementSize; col += 1) {
            if ((row + col) % 2 === 0) ctx.fillStyle = 'rgba(0, 188, 212, 0.3)';
            else ctx.fillStyle = 'rgba(0, 188, 212, 0.8)';

            ctx.fillRect(col * scale, row * scale, scale, scale);
        }
    }
}

function createImageData(data) {
    const width = data[0].length;
    const height = data.length;
    const scale = canvasSizeArea / data.length;
    const dataToImage = data;

    ctx.clearRect(0, 0, canvasSizeArea, canvasSizeArea);

    for (let row = 0; row < height; row += 1) {
        for (let col = 0; col < width; col += 1) {
            const normalizeOpacity = (data[row][col][3] / 255).toFixed(3);

            if (data[row][col].length === 6) ctx.fillStyle = `#${data[row][col]}`;
            else {
                dataToImage[row][col][3] = normalizeOpacity;
                ctx.fillStyle = `rgba(${data[row][col].join()})`;
            }
            ctx.fillRect(col * scale, row * scale, scale, scale);
        }
    }
}

async function readTextFileFetchMethod(file, callback) {
    const response = await fetch(file);

    if (response.ok) {
        const myJson = await response.json();
        callback(myJson);
    } else {
        // alert(`Error HTTP: ${response.status}`);
    }
}

let moveOn = false;
function canvasSave() {
    localStorage.setItem('canvasSave', canvas.toDataURL());
}

function canvasClear() {
    ctx.clearRect(0, 0, canvasSizeArea, canvasSizeArea);
    localStorage.removeItem('canvasSave');
    localStorage.removeItem('currentAction');
}

function drawInMatrix(e) {
    const rect = e.target.getBoundingClientRect();
    const xPositionInElement = e.clientX - rect.left;
    const yPositionInElement = e.clientY - rect.top;
    const scale = localStorage.getItem('currentScale');

    const xRectStart = Math.floor(xPositionInElement / (canvas.area / canvas.width));
    const yRectStart = Math.floor(yPositionInElement / (canvas.area / canvas.height));

    ctx.fillStyle = localStorage.getItem('currentColor');
    ctx.fillRect(xRectStart * scale, yRectStart * scale, scale, scale);

    canvasSave();
}

function drawByPencil(res, e) {
    if (res === 'down') {
        drawInMatrix(e);
        moveOn = true;
    }

    if (res === 'move' && moveOn) {
        drawInMatrix(e);
    }

    if (res === 'up' || res === 'out') {
        moveOn = false;
    }
}

function fillBucket() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = localStorage.getItem('currentColor');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvasSave();
}

function chooseColor(e) {
    const rect = e.target.getBoundingClientRect();
    const xPositionInElement = e.clientX - rect.left;
    const yPositionInElement = e.clientY - rect.top;

    const xRectStart = Math.floor(xPositionInElement / (canvas.area / canvas.width));
    const yRectStart = Math.floor(yPositionInElement / (canvas.area / canvas.height));

    const imgData = ctx.getImageData(xRectStart, yRectStart, 1, 1);
    const normalizeOpacity = (imgData.data[3] / 255).toFixed(3);
    const getColorUnderMouse = `rgba(${imgData.data[0]},${imgData.data[1]},${imgData.data[2]},${normalizeOpacity})`;

    main.querySelector('#currentColor .before').style.background = getColorUnderMouse;
    localStorage.setItem('currentColor', getColorUnderMouse);
}

function actionTool(e) {
    if (localStorage.getItem('currentAction') === 'toolFill') {
        fillBucket(e);
    } else if (localStorage.getItem('currentAction') === 'toolDropper') {
        chooseColor(e);
    }
}

function openMenu(event) {
    const { id } = event.target;
    const idParent = event.target.parentElement.id;
    let menuLinks; let
        menuSettingLinks;
    if (id === 'btnMenu' || idParent === 'btnMenu') { menuLinks = document.getElementById('menuLinks'); menuSettingLinks = document.getElementById('menuSettingLinks'); } else { menuLinks = document.getElementById('menuSettingLinks'); menuSettingLinks = document.getElementById('menuLinks'); }

    menuSettingLinks.style.display = 'none';

    if (menuLinks.style.display === 'block') {
        menuLinks.style.display = 'none';
    } else {
        menuLinks.style.display = 'block';
    }
}

function activeMenu() {
    const pathToCursorFolder = 'assets/icons/';
    btnMenu.addEventListener('click', openMenu);
    btnMenuSetting.addEventListener('click', openMenu);

    const menuTools = document.getElementById('menuSetTools');
    const menuItem = menuTools.getElementsByClassName('menu-set__list-item');

    for (let i = 0; i < menuItem.length; i += 1) {
        menuItem[i].addEventListener('click', () => {
            const current = document.getElementsByClassName('active');
            if (current[0]) current[0].className = current[0].className.replace(' active', '');
            this.className += ' active';
            canvas.style.cursor = `url("${pathToCursorFolder}cursor-${window.event.target.id}.png") 0 32, auto`;

            localStorage.setItem('currentAction', window.event.target.id);
        });
    }
}

function colorSelectorAction() {
    const currentColor = currentColorSelector.value;
    const prevColor = localStorage.getItem('currentColor');
    showPrevColor.style.background = prevColor;
    localStorage.setItem('prevColor', prevColor);
    showCurrentColor.style.background = currentColor;
    localStorage.setItem('currentColor', currentColor);
}

function getLinkToImage(cunvasSize = 512, town = 'London') {
    const url = `https://api.unsplash.com/photos/random?query=town,${town}&client_id=${keyAccessUnsplash}`;


    const testPeriod = false;
    const nameImage = 'test.jpg';
    const domain = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/`;
    const pathToFolderData = `${projectFolder}/assets/images/`;
    const pathToDataFile = domain + pathToFolderData + nameImage;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const img = new Image();
            const imagesLinkLocal = localStorage.setItem('imageUrl', img.src);
            if (imagesLinkLocal) { img.src = localStorage.getItem('imageUrl', img.src); }
            else {
                img.src = data.urls.small;
                localStorage.setItem('imageUrl', img.src);
            }
            if (testPeriod) img.src = pathToDataFile;
            img.onload = function () {
                let resizeWidth = this.width;
                let resizeHeight = this.height;
                let startPointX;
                let startPointY;                

                if (resizeWidth >= resizeHeight) {
                    resizeHeight = Math.round(resizeHeight / (resizeWidth / cunvasSize));
                    startPointX = 0;
                    startPointY = Math.round((cunvasSize - resizeHeight) / 2);
                    resizeWidth = cunvasSize;
                } else {
                    resizeWidth = Math.round(resizeWidth / (resizeHeight / cunvasSize));
                    startPointX = Math.round((512 - resizeWidth) / 2);
                    startPointY = 0;
                    resizeHeight = canvas.area;
                }
                ctx.drawImage(img, startPointX, startPointY, resizeWidth, resizeHeight);
                const imageData = ctx.getImageData(startPointX, startPointY, resizeWidth, resizeHeight);
                ctx.putImageData(imageData, startPointX, startPointY);
                localStorage.setItem('imageData', imageData);
                canvasSave();
            };
        });
}

function grayscale() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
    canvasSave();
};


document.addEventListener('DOMContentLoaded', () => { init(); });
document.addEventListener('DOMContentLoaded', () => { activeMenu(); });

const dataURL = localStorage.getItem('canvasSave');
if (!dataURL) document.addEventListener('DOMContentLoaded', () => { field128x128.click() });

toolClear.addEventListener('click', canvasClear);
canvas.addEventListener('click', actionTool);


canvas.addEventListener('mousemove', (e) => {
    if (localStorage.getItem('currentAction') === 'toolPencil') drawByPencil('move', e);
}, false);
canvas.addEventListener('mousedown', (e) => {
    if (localStorage.getItem('currentAction') === 'toolPencil') drawByPencil('down', e);
}, false);
canvas.addEventListener('mouseup', (e) => {
    if (localStorage.getItem('currentAction') === 'toolPencil') drawByPencil('up', e);
}, false);
canvas.addEventListener('mouseout', (e) => {
    if (localStorage.getItem('currentAction') === 'toolPencil') drawByPencil('out', e);
}, false);


currentColorElement.addEventListener('click', () => { currentColorSelector.click(); });
currentColorSelector.addEventListener('change', colorSelectorAction, false);

prevColorElement.addEventListener('click', () => {
    const tempColor = localStorage.getItem('currentColor');
    const prevColor = localStorage.getItem('prevColor');
    showCurrentColor.style.background = prevColor;
    localStorage.setItem('currentColor', prevColor);
    showPrevColor.style.background = tempColor;
    localStorage.setItem('prevColor', tempColor);
});

colorRedElement.addEventListener('click', () => {
    const tempColor = localStorage.getItem('currentColor');
    if (tempColor !== '#F74141') {
        showCurrentColor.style.background = '#F74141';
        localStorage.setItem('currentColor', '#F74141');
        showPrevColor.style.background = tempColor;
        localStorage.setItem('prevColor', tempColor);
    }
});
colorBlueElement.addEventListener('click', () => {
    const tempColor = localStorage.getItem('currentColor');
    if (tempColor !== '#41B6F7') {
        showCurrentColor.style.background = '#41B6F7';
        localStorage.setItem('currentColor', '#41B6F7');
        showPrevColor.style.background = tempColor;
        localStorage.setItem('prevColor', tempColor);
    }
});

field4x4.addEventListener('click', () => { createCanvasArea(4); });
field16x16.addEventListener('click', () => { createCanvasArea(16); });
field32x32.addEventListener('click', () => { createCanvasArea(32); });
field64x64.addEventListener('click', () => { createCanvasArea(64); });
field128x128.addEventListener('click', () => { createCanvasArea(128); });

toolGrayscale.addEventListener('click', () => { grayscale() });
loadTownBtn.addEventListener('click', () => {
    if (nameTown.value) {
        const canvasSize = 2 ** (minPowerCanvas + parseInt(rangeSize.value));
        getLinkToImage(canvasSize, nameTown.value);
        createCanvasArea(canvasSize);
        townError.innerHTML = '';
    } else {
        townError.innerHTML = 'Name city is empty';

    }
});

rangeSize.addEventListener('input', () => {
    const canvasSize = 2 ** (minPowerCanvas + parseInt(rangeSize.value));

    const imageData = localStorage.getItem('imageData');
    if (imageData) createImageData(imageData);
    createCanvasArea(canvasSize);
    currentSize.innerHTML = canvas.width + 'x' + canvas.height;
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyB') toolFill.click();
    else if (e.code === 'KeyP') toolPencil.click();
    else if (e.code === 'KeyC') toolDropper.click();
});
