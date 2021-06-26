
var entityCustomizerCount = 0;

function addEntityCustomizerBox() {
    var element = document.getElementById(`customizer${entityCustomizerCount + 1}`);
    var newElement = document.createElement('div');
    newElement.setAttribute('id', `customizer${entityCustomizerCount + 2}`);
    newElement.style.position = 'relative'; 
    newElement.style.width = '90%'; 
    newElement.style.height = '35%';
    newElement.style.top = '20';
    newElement.style.left = '0';
    newElement.style.marginTop = '5%';
    newElement.style.marginLeft = '5%';
    newElement.style.outline = 'solid lightcyan';
    newElement.style.outlineWidth = 'thin';

    element.insertAdjacentElement('afterend', newElement);
    entityCustomizerCount++;
}
