import { mainEl, cursorSizeDefault, dataURL } from './constants';
import { isRgbaVisible, getElById } from './utils';

export const mainCanvas = document.getElementById('canvas');
export const mainCanvasSizeArea = 512;
export const mainCtx = mainCanvas.getContext('2d');

mainCtx.imageSmoothingEnabled = false;
mainCanvas.area = mainCanvasSizeArea;
mainCanvas.width = localStorage.getItem('currentWidth') || mainCanvasSizeArea;
mainCanvas.height = localStorage.getItem('currentHeight') || mainCanvasSizeArea;

const frames = [];
const ctxFrames = [];
const frameEl = getElById('frame');
frames.push(frameEl);
const framesSizeArea = 128;
ctxFrames.push(frames[0].getContext('2d'));
localStorage.setItem('currentFrameId', 0);   

function getCanvasSave(){
    return localStorage.getItem('canvasSave');
} 

export function loadCanvasImageToFrame() {
    ctxFrames[0].imageSmoothingEnabled = false;

    frames[0] = getElById('frame');
    ctxFrames[0] = frames[0].getContext('2d');

    frames[0].area = framesSizeArea;
    frames[0].width = framesSizeArea;
    frames[0].height = framesSizeArea;

    if (dataURL) {
        const img = new Image();
        img.src = getCanvasSave();
        img.onload = () => {
            ctxFrames[0].drawImage(img, 0, 0);
        };
    }

}

export function saveCanvas() {
    localStorage.setItem('canvasSave', mainCanvas.toDataURL());  
    localStorage.setItem('frameList', frames);     
    loadCanvasImageToFrame();
}

export function clearCanvas() {
    mainCtx.clearRect(0, 0, mainCanvasSizeArea, mainCanvasSizeArea);
    localStorage.removeItem('canvasSave');
    localStorage.removeItem('currentAction');
    saveCanvas();        
}

export function loadCanvasImage(action) {
    if (dataURL) {
        const img = new Image();
        if (action === 'reload') img.src = localStorage.getItem('canvasSave');
        else img.src = dataURL;
        img.onload = () => {
            mainCtx.drawImage(img, 0, 0);
        };
    }
}

export function changeSizeBgCanvas() {
    const basicSizeBgCanvas = 32;
    const elementSize = parseInt(localStorage.getItem('currentElementSize'), 10);    
    const recountBgSize = basicSizeBgCanvas / (elementSize / basicSizeBgCanvas);
    
    mainCanvas.style.backgroundSize = `${recountBgSize}px ${recountBgSize}px`;  
    loadCanvasImageToFrame();  
}

export function createCanvasArea(elementSize) {

    if (typeof elementSize !== "number") {
        throw TypeError("The elementSize argument should be a number.")
    }
    if (elementSize < 0) {
        throw Error("The elementSize should be positive.")
    }

    localStorage.setItem('currentElementSize', elementSize);
    const scale = 1;// const scale = canvasSizeArea / elementSize;
    localStorage.setItem('currentScale', scale);

    mainCanvas.width = elementSize;
    mainCanvas.height = elementSize;

    frames[0].width = elementSize;
    frames[0].height = elementSize;

    localStorage.setItem('currentWidth', mainCanvas.width);
    localStorage.setItem('currentHeight', mainCanvas.height);

    mainCtx.clearRect(0, 0, mainCanvasSizeArea, mainCanvasSizeArea);

    loadCanvasImage('reload');

    changeSizeBgCanvas();

    localStorage.setItem('currentSizeCanvas', window.event.target.id);
}

export function createImageData(data) {
    const width = data[0].length;
    const height = data.length;
    const scale = mainCanvasSizeArea / data.length;
    const dataToImage = data;

    mainCtx.clearRect(0, 0, mainCanvasSizeArea, mainCanvasSizeArea);

    for (let row = 0; row < height; row += 1) {
        for (let col = 0; col < width; col += 1) {
            const normalizeOpacity = (data[row][col][3] / 255).toFixed(3);

            if (data[row][col].length === 6) mainCtx.fillStyle = `#${data[row][col]}`;
            else {
                dataToImage[row][col][3] = normalizeOpacity;
                mainCtx.fillStyle = `rgba(${data[row][col].join()})`;
            }
            mainCtx.fillRect(col * scale, row * scale, scale, scale);
        }
    }
}

export function drawInMatrix(xRectStart, yRectStart) {
    let penUnitSize = localStorage.getItem('cursorSize') || cursorSizeDefault;
    const currentAction = localStorage.getItem('currentAction');
    const scale = localStorage.getItem('currentScale');

    if (currentAction === 'toolSomeColor' || currentAction === 'toolFill') penUnitSize = cursorSizeDefault;
    mainCtx.fillStyle = localStorage.getItem('currentColor');
    mainCtx.fillRect(xRectStart * scale, yRectStart * scale, scale * penUnitSize, scale * penUnitSize);
}

export function drawStrokeInMatrix(xStart, yStart, xFinish, yFinish) {
    let x0 = Number(xStart);
    let y0 = Number(yStart);
    const x1 = xFinish;
    const y1 = yFinish;

    const dx = Math.abs(x1 - x0);
    const sx = x0 < x1 ? 1 : -1;
    const dy = Math.abs(y1 - y0);
    const sy = y0 < y1 ? 1 : -1;
    let err = (dx > dy ? dx : -dy) / 2;

    let checkBreak = true;
    while (checkBreak) {
        drawInMatrix(x0, y0);
        if (x0 === x1 && y0 === y1) checkBreak = false;
        const e2 = err;
        if (e2 > -dx) { err -= dy; x0 += sx; }
        if (e2 < dy) { err += dx; y0 += sy; }
    }
}

export function eraseInMatrix(xRectStart, yRectStart) {
    const penUnitSize = localStorage.getItem('cursorSize') || cursorSizeDefault;
    const scale = localStorage.getItem('currentScale');
    mainCtx.clearRect(xRectStart * scale, yRectStart * scale, scale * penUnitSize, scale * penUnitSize);
}

export function getCursorPosition(e) {
    const rect = e.target.getBoundingClientRect();
    const xPositionInElement = e.clientX - rect.left;
    const yPositionInElement = e.clientY - rect.top;
    const xRectStart = Math.floor(xPositionInElement / (mainCanvas.area / mainCanvas.width));
    const yRectStart = Math.floor(yPositionInElement / (mainCanvas.area / mainCanvas.height));

    return {
        xRectStart,
        yRectStart,
    };
}

export function setCurrentColor(getColorUnderMouse) {
    const isColorVisible = isRgbaVisible(getColorUnderMouse);
    if (isColorVisible) {
        mainEl.querySelector('#currentColor .before').style.background = getColorUnderMouse;
        localStorage.setItem('currentColor', getColorUnderMouse);
    }
}

export function getColorByPosition(xRectStart, yRectStart) {
    const imgData = mainCtx.getImageData(xRectStart, yRectStart, 1, 1);
    const normalizeOpacity = (imgData.data[3] / 255).toFixed(3);
    const getColorUnderMouse = `rgba(${imgData.data[0]},${imgData.data[1]},${imgData.data[2]},${normalizeOpacity})`;

    return getColorUnderMouse;
}