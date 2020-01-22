import {btnAddFrameEl, toolEraserEl, toolStrokeEl, toolSomeColorEl, toolPencilEl, toolFillEl, toolDropperEl, showCurrentColorEl, currentColorSelectorEl, showPrevColorEl, toolClearEl, currentColorEl, prevColorEl, colorRedEl, colorBlueEl, field32x32El, field64x64El, field128x128El, currentSizeEl, rangeSizeEl, dataURL } from './constants';
import { mainCanvas, createCanvasArea, clearCanvas} from './canvas';
import { drawByPencil, drawStroke, drawByEraser, colorSelectorAction, fillBucket, paintSomeColor, chooseColor } from './tools';
import { cursorSizeToDiv } from './view';

export function actionTool(e) {
    const currentAction = localStorage.getItem('currentAction');

    if (currentAction === 'toolFill') {
        fillBucket(e);
    } else if (currentAction === 'toolSomeColor') {
        paintSomeColor(e);
    } else if (currentAction === 'toolDropper') {
        chooseColor(e);
    }

}

function initToolsListeners() {

    toolClearEl.addEventListener('click', clearCanvas);

    const sizeCanvas32x32 = 32;
    const sizeCanvas64x64 = 64;
    const sizeCanvas128x128 = 128;

    field32x32El.addEventListener('click', () => { createCanvasArea(sizeCanvas32x32); });
    field64x64El.addEventListener('click', () => { createCanvasArea(sizeCanvas64x64); });
    field128x128El.addEventListener('click', () => { createCanvasArea(sizeCanvas128x128); });

    rangeSizeEl.addEventListener('input', () => {
        const cursorSize = parseInt(rangeSizeEl.value, 10);

        localStorage.setItem('cursorSize', cursorSize);
        currentSizeEl.innerHTML = `${cursorSizeToDiv(cursorSize)}`;
    });

}

function initColorsListeners() {

    currentColorEl.addEventListener('click', () => { currentColorSelectorEl.click(); });
    currentColorSelectorEl.addEventListener('change', colorSelectorAction);

    prevColorEl.addEventListener('click', () => {
        const tempColor = localStorage.getItem('currentColor');
        const prevColor = localStorage.getItem('prevColor');
        showCurrentColorEl.style.background = prevColor;
        localStorage.setItem('currentColor', prevColor);
        showPrevColorEl.style.background = tempColor;
        localStorage.setItem('prevColor', tempColor);
    });

    colorRedEl.addEventListener('click', () => {
        const tempColor = localStorage.getItem('currentColor');
        const redColorDefault = '#F74141';
        if (tempColor !== redColorDefault) {
            showCurrentColorEl.style.background = redColorDefault;
            localStorage.setItem('currentColor', redColorDefault);
            showPrevColorEl.style.background = tempColor;
            localStorage.setItem('prevColor', tempColor);
        }
    });

    colorBlueEl.addEventListener('click', () => {
        const tempColor = localStorage.getItem('currentColor');
        const blueColorDefault = '#41B6F7';
        if (tempColor !== blueColorDefault) {
            showCurrentColorEl.style.background = blueColorDefault;
            localStorage.setItem('currentColor', blueColorDefault);
            showPrevColorEl.style.background = tempColor;
            localStorage.setItem('prevColor', tempColor);
        }
    });

}

function initCanvasListeners() {
    mainCanvas.addEventListener('click', actionTool);
    mainCanvas.addEventListener('mousemove', (e) => {
        if (localStorage.getItem('currentAction') === 'toolPencil') drawByPencil('move', e);
        if (localStorage.getItem('currentAction') === 'toolEraser') drawByEraser('move', e);
        if (localStorage.getItem('currentAction') === 'toolStroke') drawStroke('move', e);
    });
    mainCanvas.addEventListener('mousedown', (e) => {
        if (localStorage.getItem('currentAction') === 'toolPencil') drawByPencil('down', e);
        if (localStorage.getItem('currentAction') === 'toolEraser') drawByEraser('down', e);
        if (localStorage.getItem('currentAction') === 'toolStroke') drawStroke('down', e);
    });
    mainCanvas.addEventListener('mouseup', (e) => {
        if (localStorage.getItem('currentAction') === 'toolPencil') drawByPencil('up', e);
        if (localStorage.getItem('currentAction') === 'toolEraser') drawByEraser('up', e);
        if (localStorage.getItem('currentAction') === 'toolStroke') drawStroke('up', e);
    });
    mainCanvas.addEventListener('mouseout', (e) => {
        if (localStorage.getItem('currentAction') === 'toolPencil') drawByPencil('out', e);
        if (localStorage.getItem('currentAction') === 'toolEraser') drawByEraser('out', e);
        if (localStorage.getItem('currentAction') === 'toolStroke') drawStroke('out', e);
    });
}

export function initListeners() {

    if (!dataURL) document.addEventListener('DOMContentLoaded', () => { field128x128El.click() });

    initToolsListeners();
    initCanvasListeners();
    initColorsListeners();

}

export function initListenersKeyBoard() {
    document.addEventListener('keyup', (e) => {
        if (e.code === 'KeyB') toolFillEl.click();
        else if (e.code === 'KeyS') toolSomeColorEl.click();
        else if (e.code === 'KeyC') toolDropperEl.click();
        else if (e.code === 'KeyP') toolPencilEl.click();
        else if (e.code === 'KeyK') toolStrokeEl.click();
        else if (e.code === 'KeyE') toolEraserEl.click();
        else if (e.code === 'KeyR') toolClearEl.click();

        else if (e.code === 'Digit1') field32x32El.click();
        else if (e.code === 'Digit2') field64x64El.click();
        else if (e.code === 'Digit3') field128x128El.click();

        else if (e.code === 'Digit5') currentColorEl.click();
        else if (e.code === 'Digit6') prevColorEl.click();
        else if (e.code === 'Digit7') colorRedEl.click();
        else if (e.code === 'Digit8') colorBlueEl.click();        
        
    });
}