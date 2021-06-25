
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

function minimizeSideBar() {
    // console.log(renderer);
    var sideNav = document.getElementById('sidenav');
    var canvas = document.getElementById('canvas-container');

    // TODO: Resize canvas after minimize pressed
    console.log(canvas);
    console.log("before: " + canvas.offsetWidth);
    canvas.style.marginLeft = "0%";
    canvas.offsetWidth = "100%";

    sideNav.style.visibility = "hidden";
    console.log("after: " + canvas.offsetWidth);
}