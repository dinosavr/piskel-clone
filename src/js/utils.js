export function hexToRgbA(hex){
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length === 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= `0x${c.join('')}`;
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1.000)';
    }
    throw new Error('Bad Hex');
}

export function isRgbaVisible(rgba){
    const arr = rgba.split(",");
    const lastItem = arr[arr.length - 1];
    const lastItemCount = parseFloat(lastItem);    
    
    return !!lastItemCount;
}

export function getElById(nameId){
    return document.getElementById(nameId);
}

export function getInnerHtmlById(nameId){
    return document.getElementById(nameId).innerHTML;
}