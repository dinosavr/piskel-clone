import { btnMenuEl, btnMenuSettingEl } from './constants';
import { mainCanvas, changeSizeBgCanvas } from './canvas';
import { getInnerHtmlById } from './utils';

export function openMenu(event) {
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

export function activeToolsMenu() {
    const pathToCursorFolder = 'icons/';
    btnMenuEl.addEventListener('click', openMenu);
    btnMenuSettingEl.addEventListener('click', openMenu);

    const menuTools = document.getElementById('menuSetTools');
    const menuItem = menuTools.getElementsByClassName('menu-set__list-item');

    Object.keys(menuItem).forEach((key) => {

        menuItem[key].addEventListener('click', (e) => {

            const currentActiveEl = e.target.parentElement.getElementsByClassName('active');
            if (currentActiveEl[0]) currentActiveEl[0].className = currentActiveEl[0].className.replace(' active', '');
            e.target.classList.add('active');

            mainCanvas.style.cursor = `url("${pathToCursorFolder}cursor-${window.event.target.id}.png") 0 32, auto`;

            localStorage.setItem('currentAction', window.event.target.id);
        });
    });

}

export function activeSizeMenu() {

    const menuSizes = document.getElementById('menuSupport');
    const menuItem = menuSizes.getElementsByClassName('menu-set__list-link');

    Object.keys(menuItem).forEach((key) => {

        menuItem[key].addEventListener('click', (e) => {

            const currentActiveEl = e.target.parentElement.parentElement.getElementsByClassName('active');
            if (currentActiveEl[0]) currentActiveEl[0].className = currentActiveEl[0].className.replace(' active', '');
            e.target.classList.add('active');

            changeSizeBgCanvas();
            localStorage.setItem('currentSizeCanvas', window.event.target.id);
        });
    });

}

export function cursorSizeToDiv(size) {
    const maxSizeDiv = 4;
    const zoomIn = 4;
    const baseHtml = `Cursor Size: 
    <div class="current-size-info" style = "width:${maxSizeDiv * zoomIn}px; height:${maxSizeDiv * zoomIn}px">
    <div class="current-size-icon" style = "width:${size * zoomIn}px; height:${size * zoomIn}px"></div>
    </div>
    `;
    return baseHtml;
}

function createFrame2El(nameId) {

    const liEl = document.createElement('li');
    liEl.className = 'column';
    liEl.setAttribute('draggable', 'true');
    const headEl = document.createElement('header');
    const initialFrame = document.createElement('canvas');
    initialFrame.width = 128;
    initialFrame.height = 128;
    initialFrame.id = nameId;
    initialFrame.className = 'frames';
    initialFrame.innerText = 'Upgrade your browser. Sir';
    headEl.appendChild(initialFrame);
    liEl.appendChild(headEl);
    const ulEl = document.createElement('li');
    ulEl.appendChild(liEl);

    return ulEl.innerHTML;

}

function addFrame() {
    const frames = localStorage.getItem('frameList');  

    const newListFrames = `${getInnerHtmlById('framesList')}${createFrame2El(`frame-${frames.length}`)}`;
    document.getElementById("framesList").innerHTML = newListFrames;
    document.getElementById('frame').addEventListener('click', () => {        
    })
}

function createBtnAddFrame(nameId) {

    const buttonEl = `<button id="${nameId}">Add new frame</button>`;

    document.getElementById("blockBtnAdd").innerHTML = buttonEl;
    document.getElementById(nameId).addEventListener('click', () => {
        addFrame();
    })
}


export function addEventListenerToEl(nameId, nameAction) {
    document.getElementById(nameId).addEventListener(nameAction, () => {
        addFrame();
    })
}

export function createListFrames() {

    createBtnAddFrame('btnAddFrame');

    const liEl = document.createElement('li');
    liEl.className = 'column';
    const headEl = document.createElement('header');
    const initialFrame = document.createElement('canvas');
    initialFrame.id = 'frame';
    initialFrame.className = 'frames';
    initialFrame.innerText = 'Upgrade your browser';
    headEl.appendChild(initialFrame);
    liEl.appendChild(headEl);

    document.getElementById('framesList').innerHTML = '';
    document.getElementById('framesList').appendChild(liEl);    

    document.getElementById('frame').addEventListener('click', () => {        
    })

}