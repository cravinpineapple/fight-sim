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
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()

// making floor
const planeGeometry = new THREE.PlaneGeometry(1000, 400, 1, 1);
const planeMesh = new THREE.MeshStandardMaterial();
planeMesh.color = new THREE.Color(0x808080);
const plane = new THREE.Mesh(planeGeometry, planeMesh);
plane.castShadow = false;
plane.receiveShadow = true;
// plane.rotation.x = -Math.PI / 2;
plane.position.set(200, -75, -10);
scene.add(plane);

const boxDimensions = 5;
// Objects
const geometry = new THREE.BoxGeometry(boxDimensions, boxDimensions, boxDimensions);
// creating AI
var aiPosition = {
    x: 176,
    y: -66,
    z: 0,
};

var aiSize = {
    width: boxDimensions,
    height: boxDimensions,
    depth: boxDimensions,
};

var playerPosition = {
    x: 200,
    y: -134,
    z: 0,
};

var player2Position = {
    x: 316,
    y: -15,
    z: 0,
};


const gWidth = 139;
const gHeight = 55;
const grid = new NodeGrid(gHeight, gWidth, scene, { x: 0, y: 0, z: -aiSize.depth / 2 }, 5);

function getRandomPosition() {
    let minX = 1;
    let maxX = gWidth * boxDimensions - 20;
    let minY = -1;
    let maxY = -(gHeight - 2) * boxDimensions;

    let randX = Math.floor(Math.random() * (maxX - minX + 1) + minX);
    let randY = Math.floor(Math.random() * (maxY - minY + 1) + minY);

    return { x: randX, y: randY, z: 0 };
}

let playerSquare = new SquareAI(0xff0000, aiSize, playerPosition, scene, 0.03, grid);
let playerSquare2 = new SquareAI(0xFF00FF, aiSize, player2Position, scene, 0.03, grid);
playerSquare.renderObj.name = "playersquare";

// AI Square
let ais = []
let aiCount = 50;

for (let i = 0; i < aiCount; i++) {
    ais.push(new SquareAI(0x00ffff, aiSize, getRandomPosition(), scene, 0.5, grid));
    ais[i].preys.push(playerSquare);
    ais[i].preys.push(playerSquare2);
    ais[i].pathLineVisible = false;
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
camera.position.set(340, -143, 190); // 190, -65, 150

const perpCam = gui.addFolder('Orth Cam 1');

perpCam.add(camera.position, 'x').step(0.5);
perpCam.add(camera.position, 'y').step(0.5);
perpCam.add(camera.position, 'z').step(0.5);
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


var delta;
var speed = 0.05;


// building line from AI to clicked point
var vec = new THREE.Vector3();
var pos = new THREE.Vector3();
var path = new THREE.Line();
let fraction = 0;
let lineInfo = {
    lineLength: null,
    pointsPath: null,
    fraction: null
};

// convert click cords to Three.js 3D coordinates and makes aiSquare follow path
canvas.addEventListener("click", (e) => {
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

    // print cords (camera)
    if (e.keyCode == 80) {
        p = true;
    }

    // up
    if (e.keyCode == 87) {
        up = true;
    }
    // left
    if (e.keyCode == 65) {
        left = true;
    }
    // down
    if (e.keyCode == 83) {
        down = true;
    }
    // right
    if (e.keyCode == 68) {
        right = true;
    }

    // arrow keys
    if (e.keyCode == 38) {
        aUp = true;
    }
    // left
    if (e.keyCode == 37) {
        aLeft = true;
    }
    // down
    if (e.keyCode == 40) {
        aDown = true;
    }
    // right
    if (e.keyCode == 39) {
        aRight = true;
    }

    // zoom out
    if (e.keyCode == 81) {
        zoomOut = true;
    }

    // zoom in
    if (e.keyCode == 69) {
        zoomIn = true;
    }

    // control
    if (e.keyCode == 17) {
        ctrl = true;
    }
}

document.onkeyup = () => {
    var e = e || window.event;

    // print cords (camera)
    if (e.keyCode == 80) {
        p = false;
    }

    // up
    if (e.keyCode == 87) {
        up = false;
    }
    // left
    if (e.keyCode == 65) {
        left = false;
    }
    // down
    if (e.keyCode == 83) {
        down = false;
    }
    // right
    if (e.keyCode == 68) {
        right = false;
    }

    if (e.keyCode == 38) {
        aUp = false;
    }
    // left
    if (e.keyCode == 37) {
        aLeft = false;
    }
    // down
    if (e.keyCode == 40) {
        aDown = false;
    }
    // right
    if (e.keyCode == 39) {
        aRight = false;
    }

    // zoom out
    if (e.keyCode == 81) {
        zoomOut = false;
    }

    // zoom in
    if (e.keyCode == 69) {
        zoomIn = false;
    }

    if (e.keyCode == 17) {
        ctrl = false;
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

var lastUpdate = Date.now();
// var myInterval = setInterval(tick, 0);

function buttonClick() {
    playerSquare.material.color.setHex(Math.random() * 0xffffff);
    // aiSquare.renderObj.material.color.setHex(Math.random() * 0xffffff);
}

document.getElementById("changeColor").addEventListener("click", buttonClick);

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

// const colorAqua = new THREE.Color(0x00FFFF);
// const colorBlack = new THREE.Color(0x000000);
// const colorRed = new THREE.Color(0xFF0000);

// goalNode.renderObj.material.color = colorRed;
// currNode.renderObj.material.color = colorAqua;

let elapsedTime = 0;
let pathUpdateInterval = 300;
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
        console.log("New Path");

        let newGoalNode1 = grid.getNode(playerSquare.getCenter());
        let newGoalNode2 = grid.getNode(playerSquare2.getCenter());

        if (newGoalNode1.position != goalNode.position) {
            goalNode = newGoalNode1;
            ais.forEach(e => e.updatePath());
        }

        if (newGoalNode2.position != goalNode2.position) {
            goalNode2 = newGoalNode2;
            ais.forEach(e => e.updatePath());
        }
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();