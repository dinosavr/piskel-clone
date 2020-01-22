import {toolPencilEl, showCurrentColorEl, currentColorSelectorEl, showPrevColorEl, currentSizeEl, rangeSizeEl, cursorSizeDefault, field64x64El} from './constants';
import {mainCanvas, loadCanvasImage, loadCanvasImageToFrame, changeSizeBgCanvas} from './canvas';
import {cursorSizeToDiv, activeToolsMenu, activeSizeMenu, createListFrames} from './view';
import { initListeners, initListenersKeyBoard } from './listeners';
import initDragDrop from './dragDropList';

function initColors(){
    const currentColorDefault = 'rgb(255, 193, 7)';
    const currentColorSelectorDefault = '#ffc107';
    const prevColorDefault = 'rgb(65, 247, 149)';

    const currentColor = localStorage.getItem('currentColor');
    if (currentColor) { showCurrentColorEl.style.background = currentColor; } else {
        showCurrentColorEl.style.background = currentColorDefault;
        currentColorSelectorEl.setAttribute('value', currentColorSelectorDefault);
        localStorage.setItem('currentColor', currentColorDefault);
    }
    const prevColor = localStorage.getItem('prevColor');
    if (prevColor) { showPrevColorEl.style.background = prevColor; } else {
        showPrevColorEl.style.background = prevColorDefault;
        localStorage.setItem('prevColor', prevColorDefault);
    }
}

function initCurrentAction(){
    const currentAction = localStorage.getItem('currentAction');
    
    if (currentAction !== null) {
        document.getElementById(currentAction).classList.add('active');
        const pathToCursorFolder = 'icons/';
        const cursorBgImagePosition = '0 32, auto';
        mainCanvas.style.cursor = `url("${pathToCursorFolder}cursor-${currentAction}.png") ${cursorBgImagePosition}`;
    } else toolPencilEl.click();    

}

function initCurrentSizeCanvas(){
    const currentSizeCanvas = localStorage.getItem('currentSizeCanvas');

    if (currentSizeCanvas !== null) {
        document.getElementById(currentSizeCanvas).classList.add('active');        
    } else field64x64El.click();
}

function initCurrentCursor(){
    const cursorSize = localStorage.getItem('cursorSize') || cursorSizeDefault;

    currentSizeEl.innerHTML = `${cursorSizeToDiv(cursorSize)}`;
    rangeSizeEl.value = cursorSize;
}

export function init(){

    initCurrentAction();
    initColors();
    initCurrentSizeCanvas();
    loadCanvasImage();
    changeSizeBgCanvas();   
    initCurrentCursor();    

    activeToolsMenu();
    activeSizeMenu();
    
    createListFrames();

    initListeners();
    initListenersKeyBoard();         
    initDragDrop(); 
 
    loadCanvasImageToFrame();
}
export function initDef(){
   return 'Second function, Not Default export';
}