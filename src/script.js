import './style.css'
import * as THREE from 'three'
import SquareAI from './Entity/ai.js';
import NodeGrid from './Entity/nodeGrid.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const entities = [];

// Debug
const gui = new dat.GUI()
// Canvas
// const canvasContainer = document.getElementById('canvas-container');
const sideBar = document.getElementById('sidenav');
const bottomBar = document.getElementById('navbar');
const canvas = document.querySelector('canvas.webgl')
const canvasContainer = document.getElementById('canvas-container');
const sideNavMaximizeButton = document.getElementById('sidenav-header-maximize-button');

// Renderer
var renderer = new THREE.WebGLRenderer({
    canvas: canvas, alpha: true,
})
var sideBarWidth = sideBar.offsetWidth;
const bottomBarHeight = bottomBar.offsetHeight;
const windowWidth = document.documentElement.clientWidth
const windowHeight = document.documentElement.clientHeight
// setting renderer size
// renderer.setSize(windowWidth - sideBarWidth, windowHeight - bottomBarHeight);
renderer.setSize(windowWidth, windowHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Scene
const scene = new THREE.Scene()

// making floor
const planeGeometry = new THREE.PlaneGeometry(2000, 800, 1, 1);
const planeMesh = new THREE.MeshStandardMaterial();
planeMesh.color = new THREE.Color(0x808080);
const plane = new THREE.Mesh(planeGeometry, planeMesh);
plane.castShadow = false;
plane.receiveShadow = true;
plane.position.set(200, -75, -10);
scene.add(plane);

const boxDimensions = 5;

var aiSize = {
    width: boxDimensions,
    height: boxDimensions,
    depth: boxDimensions,
};

var playerPosition = {
    x: 275,
    y: -134,
    z: 0,
};

var player2Position = {
    x: 300,
    y: -15,
    z: 0,
};

var nodeWidth = boxDimensions * 2;
const gWidth = 64; // 139 w/ boxDimensions * 2
const gHeight = 29; // 55 w/ boxDimensions * 2
const grid = new NodeGrid(gHeight, gWidth, scene, { x: 0 + nodeWidth / 2, y: 0 - nodeWidth / 2, z: -aiSize.depth / 2 }, nodeWidth);

function getRandomPosition() {
    let minX = 1;
    let maxX = gWidth * nodeWidth - 20;
    let minY = -1;
    let maxY = -(gHeight - 2) * nodeWidth;

    let randX = Math.floor(Math.random() * (maxX - minX + 1) + minX);
    let randY = Math.floor(Math.random() * (maxY - minY + 1) + minY);

    return { x: randX, y: randY, z: 0 };
}

let playerSquare = new SquareAI(0xff0000, aiSize, playerPosition, scene, 0.05, grid);
let playerSquare2 = new SquareAI(0xFF00FF, aiSize, player2Position, scene, 0.05, grid);
playerSquare.renderObj.name = "playersquare";

// AI Square
let ais = []
let aiCount = 10;

for (let i = 0; i < aiCount; i++) {
    ais.push(new SquareAI(0x00ffff, aiSize, getRandomPosition(), scene, 0.5, grid));
    ais[i].preys.push(playerSquare);
    // ais[i].preys.push(playerSquare2);
    ais[i].pathLineVisible = true;
}

const testObj1 = gui.addFolder('Player Object');


let topLeft = {
    x: Math.round(-canvas.clientWidth / 2),
    y: Math.round(canvas.clientHeight / 2),
};

for (let i = 0; i < grid.grid.length; i++) {
    for (let j = 0; j < grid.grid[i].length; j++) {
        entities.push(grid.grid[i][j]);
    }
}

// AI 
testObj1.add(playerSquare.renderObj.position, 'x').step(0.5);
testObj1.add(playerSquare.renderObj.position, 'y').step(0.5);
testObj1.add(playerSquare.renderObj.position, 'z').step(2);

// POINT LIGHT
const light1 = gui.addFolder('Light 1');

const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.position.set(0, 0, 40);
light1.add(pointLight.position, 'x').min(-500).max(500).step(0.001);
light1.add(pointLight.position, 'y').min(-500).max(500).step(0.001);
light1.add(pointLight.position, 'z').min(1).max(115).step(0.01);
light1.add(pointLight, 'intensity').min(0).max(10).step(0.01);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);

const lightColor = {
    color: 0x7cc8ed,
}

light1.addColor(lightColor, 'color').onChange(() => {
    pointLight.color.set(lightColor.color);
});

// AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight(0x404040);

scene.add(ambientLight);
scene.add(pointLight)
scene.add(pointLightHelper);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

const viewSize = 900;
const aspectRatio = canvas.width / canvas.height;
// Base camera
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 500);
camera.position.set(322, -142, 190); // 190, -65, 150

const perpCam = gui.addFolder('Orth Cam 1');

perpCam.add(camera.position, 'x').step(0.5);
perpCam.add(camera.position, 'y').step(0.5);
perpCam.add(camera.position, 'z').step(0.5);
scene.add(camera)

/**
 * Animate
 */

var delta;
var speed = 0.05;

let lastMouseNode;
let mouseDown = false;
// convert click cords to Three.js 3D coordinates and makes aiSquare follow path
canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    let vec = new THREE.Vector3();
    let pos = new THREE.Vector3();

    vec.set((e.clientX / canvas.clientWidth) * 2 - 1, - (e.clientY / canvas.clientHeight) * 2 + 1, 0.5);
    vec.unproject(camera);
    vec.sub(camera.position).normalize();

    var distance = - camera.position.z / vec.z;

    pos.copy(camera.position).add(vec.multiplyScalar(distance));

    if (ctrl) {
        // prints click coordinates
        console.log(pos);
        return;
    }
    else {
        lastMouseNode = grid.getNode(pos);
        if (lastMouseNode.wall == null) lastMouseNode.addWall();
        else lastMouseNode.removeWall();

        console.log(lastMouseNode.walkable);
    }
});

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
});

canvas.addEventListener("mousemove", (e) => {
    let vec = new THREE.Vector3();
    let pos = new THREE.Vector3();

    vec.set((e.clientX / canvas.clientWidth) * 2 - 1, - (e.clientY / canvas.clientHeight) * 2 + 1, 0.5);
    vec.unproject(camera);
    vec.sub(camera.position).normalize();

    var distance = - camera.position.z / vec.z;

    pos.copy(camera.position).add(vec.multiplyScalar(distance));
 
    // CLICK DRAGGING FOR WALLS
    let node = grid.getNode(pos);
    if (ctrl) {
        // prints click coordinates
        return;
    }
    else if (lastMouseNode != node && mouseDown) {
        lastMouseNode = node;
        if (node.wall == null) node.addWall();
        else node.removeWall();
    }
});

document.getElementById("floatButton").addEventListener("click", function() {
    console.log("Starting...");
    ais.forEach(e => e.updatePathingGrid());
});

var p = false;
var up = false, down = false, left = false, right = false; // WASD
var aUp = false, aDown = false, aLeft = false, aRight = false; // arrow keys
var zoomOut = false, zoomIn = false;
var ctrl = false;

let goalNode = grid.getNode(playerSquare.getCenter());
let goalNode2 = grid.getNode(playerSquare2.getCenter());

document.onkeydown = () => {
    var e = e || window.event;

    switch (e.keyCode) {
        case 80:
            p = true;
            break;
        case 87:
            up = true;
            break;
        case 65:
            left = true;
            break;
        case 83:
            down = true;
            break;
        case 68:
            right = true;
            break;
        case 38:
            aUp = true;
            break;
        case 37:
            aLeft = true;
            break;
        case 40:
            aDown = true;
            break;
        case 39:
            aRight = true;
            break;
        case 81:
            zoomOut = true;
            break;
        case 69:
            zoomIn = true;
            break;
        case 17:
            ctrl = true;
            break;
    }
}

document.onkeyup = () => {
    var e = e || window.event;

    switch (e.keyCode) {
        case 80:
            p = false;
            break;
        case 87:
            up = false;
            break;
        case 65:
            left = false;
            break;
        case 83:
            down = false;
            break;
        case 68:
            right = false;
            break;
        case 38:
            aUp = false;
            break;
        case 37:
            aLeft = false;
            break;
        case 40:
            aDown = false;
            break;
        case 39:
            aRight = false;
            break;
        case 81:
            zoomOut = false;
            break;
        case 69:
            zoomIn = false;
            break;
        case 17:
            ctrl = false;
            break;
    }
}

const movement = () => {
    if (up) playerSquare.group.position.y += playerSquare.speed * delta;
    if (left) playerSquare.group.position.x -= playerSquare.speed * delta;
    if (down) playerSquare.group.position.y -= playerSquare.speed * delta;
    if (right) playerSquare.group.position.x += playerSquare.speed * delta;
}

const moveCamera = () => {
    if (zoomIn) camera.position.z -= speed * delta;
    if (zoomOut) camera.position.z += speed * delta;
    if (p) console.log(camera.position);

    if (ctrl) {
        if (aUp) camera.position.y += speed * delta;
        if (aLeft) camera.position.x -= speed * delta;
        if (aDown) camera.position.y -= speed * delta;
        if (aRight) camera.position.x += speed * delta;
    }
    else {
        if (aUp) playerSquare2.group.position.y += playerSquare.speed * delta;
        if (aLeft) playerSquare2.group.position.x -= playerSquare.speed * delta;
        if (aDown) playerSquare2.group.position.y -= playerSquare.speed * delta;
        if (aRight) playerSquare2.group.position.x += playerSquare.speed * delta;
    }
}

// hiden side nav
document.getElementById('sidenav-header-minimize').addEventListener("click", function() {

    sideNavMaximizeButton.style.visibility = "visible";
    canvasContainer.style.marginLeft = "0%";
    sideBar.style.visibility = "hidden";
});

// show side nav
document.getElementById('sidenav-header-maximize-button').addEventListener("click", function() {
    sideNavMaximizeButton.style.visibility = "hidden";
    sideBar.style.visibility = "visible";
});

var lastUpdate = Date.now();

function resizeCanvasToDiv() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

let elapsedTime = 0;
let pathUpdateInterval = 150;

const tick = () => {
    resizeCanvasToDiv();
    // const elapsedTime = clock.getElapsedTime()
    var now = Date.now();
    delta = now - lastUpdate;
    lastUpdate = now;

    elapsedTime += delta;

    // aiSquare.checkCollision();

    movement();
    moveCamera();


    ais.forEach(e => e.tryMove());

    if (elapsedTime >= pathUpdateInterval) {
        elapsedTime = 0;
        // console.log("New Path");

        let newGoalNode1 = grid.getNode(playerSquare.getCenter());
        // let newGoalNode2 = grid.getNode(playerSquare2.getCenter());

        if (newGoalNode1.position != goalNode.position) {
            goalNode = newGoalNode1;
            ais.forEach(e => e.updatePath());
        }
        
        // if (newGoalNode2.position != goalNode2.position) {
        //     goalNode2 = newGoalNode2;
        //     ais.forEach(e => e.updatePath());
        // }
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();