import { showCurrentColorEl, currentColorSelectorEl, showPrevColorEl } from './constants';
import { mainCtx, drawInMatrix, drawStrokeInMatrix, eraseInMatrix, saveCanvas, getCursorPosition, setCurrentColor, getColorByPosition, loadCanvasImageToFrame} from './canvas';

let moveOn = false;
let recolorListOfPoints = [];

export function drawByPencil(res, e) {

    const { xRectStart, yRectStart } = getCursorPosition(e);

    if (res === 'down') {
        drawInMatrix(xRectStart, yRectStart);
        moveOn = true;
    }

    if (res === 'move' && moveOn) {
        drawInMatrix(xRectStart, yRectStart);
    }

    if (res === 'up' || res === 'out') {
        moveOn = false;
        saveCanvas();        
    }

    
    
}

export function drawStroke(res, e) {

    const { xRectStart, yRectStart } = getCursorPosition(e);
    let xStartStroke;
    let yStartStroke;
    let xFinishStroke;
    let yFinishStroke;

    if (res === 'down') {
        localStorage.setItem('xStartStroke', xRectStart);
        localStorage.setItem('yStartStroke', yRectStart);
        drawInMatrix(xRectStart, yRectStart);
        moveOn = true;
    }

    if (res === 'up') {
        xStartStroke = localStorage.getItem('xStartStroke');
        yStartStroke = localStorage.getItem('yStartStroke');
        xFinishStroke = xRectStart;
        yFinishStroke = yRectStart;
        drawStrokeInMatrix(xStartStroke, yStartStroke, xFinishStroke, yFinishStroke);
        localStorage.removeItem('xStartStroke');
        localStorage.removeItem('yStartStroke');
        moveOn = false;
        saveCanvas();
    }

    if (res === 'out') {
        localStorage.removeItem('xStartStroke');
        localStorage.removeItem('yStartStroke');
        moveOn = false;
        saveCanvas();
    }
    
}


export function drawByEraser(res, e) {

    const { xRectStart, yRectStart } = getCursorPosition(e);

    if (res === 'down') {
        eraseInMatrix(xRectStart, yRectStart);
        moveOn = true;
    }

    if (res === 'move' && moveOn) {
        eraseInMatrix(xRectStart, yRectStart);
    }

    if (res === 'up' || res === 'out') {
        moveOn = false;
        saveCanvas();
    }
    
}

function checkColorAndDrawPoint(xCell, yCell, checkColor) {
    if (getColorByPosition(xCell, yCell) === checkColor) {
        recolorListOfPoints.push(xCell);
        recolorListOfPoints.push(yCell);
        drawInMatrix(xCell, yCell);
    }
}

function fillAreaInBorder(xRectStart, yRectStart, filledColor) {
    const currentElementSize = localStorage.getItem('currentElementSize');
    if (!recolorListOfPoints.length) drawInMatrix(xRectStart, yRectStart);

    const checkPositionInAreaCanvas = (xRectStart >= 0) && (yRectStart >= 0) && (xRectStart < currentElementSize) && (yRectStart < currentElementSize);
    const stepToNextCell = 1;

    if (checkPositionInAreaCanvas) {
        checkColorAndDrawPoint(xRectStart + stepToNextCell, yRectStart, filledColor);
        checkColorAndDrawPoint(xRectStart - stepToNextCell, yRectStart, filledColor);
        checkColorAndDrawPoint(xRectStart, yRectStart + stepToNextCell, filledColor);
        checkColorAndDrawPoint(xRectStart, yRectStart - stepToNextCell, filledColor);
    }

    if (recolorListOfPoints.length > 1 && recolorListOfPoints.length < currentElementSize * currentElementSize) {
        const yRectStartNew = recolorListOfPoints.pop();
        const xRectStartNew = recolorListOfPoints.pop();
        fillAreaInBorder(xRectStartNew, yRectStartNew, filledColor);
    }
    
}

function changeColorToColor(oldColor) {
    const currentElementSize = localStorage.getItem('currentElementSize');

    for (let i = 0; i < currentElementSize; i += 1) {
        for (let j = 0; j < currentElementSize; j += 1) {
            if (getColorByPosition(i, j) === oldColor) drawInMatrix(i, j);
        }
    }

}

export function fillBucket(e) {
    mainCtx.fillStyle = localStorage.getItem('currentColor');
    const { xRectStart, yRectStart } = getCursorPosition(e);
    const filledColor = getColorByPosition(xRectStart, yRectStart);

    recolorListOfPoints = [];
    fillAreaInBorder(xRectStart, yRectStart, filledColor);
    
    saveCanvas();
}

export function paintSomeColor(e) {
    mainCtx.fillStyle = localStorage.getItem('currentColor');
    const { xRectStart, yRectStart } = getCursorPosition(e);
    const oldColor = getColorByPosition(xRectStart, yRectStart);

    changeColorToColor(oldColor);
    saveCanvas();
}

export function chooseColor(e) {

    const { xRectStart, yRectStart } = getCursorPosition(e);
    const getColorUnderMouse = getColorByPosition(xRectStart, yRectStart);
    setCurrentColor(getColorUnderMouse);
}

export function colorSelectorAction() {
    const currentColor = currentColorSelectorEl.value;
    const prevColor = localStorage.getItem('currentColor');
    showPrevColorEl.style.background = prevColor;
    localStorage.setItem('prevColor', prevColor);
    showCurrentColorEl.style.background = currentColor;
    localStorage.setItem('currentColor', currentColor);
}