import './style.css'
import * as THREE from 'three'
import SquareAI from './Entity/ai.js';
import NodeGrid from './Entity/nodeGrid.js';
import * as dat from 'dat.gui'

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
const windowWidth = document.documentElement.clientWidth
const windowHeight = document.documentElement.clientHeight

// setting renderer size
renderer.setSize(windowWidth, windowHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Scene
const scene = new THREE.Scene()
const boxDimensions = 10;
const floorHeight = -25;
var simStarted = false;

// making floor
const backgroundPlaneGeometry = new THREE.PlaneGeometry(2500, 1500, 1, 1);
const backgroundPlaneMesh = new THREE.MeshStandardMaterial();
backgroundPlaneMesh.color = new THREE.Color(0x808080);
const backgroundPlane = new THREE.Mesh(backgroundPlaneGeometry, backgroundPlaneMesh);
backgroundPlane.castShadow = false;
backgroundPlane.receiveShadow = true;
backgroundPlane.position.set(300, -150, floorHeight - 25);
scene.add(backgroundPlane);



const nodeWidth = boxDimensions;
const gWidth = 125; // 139 w/ boxDimensions * 2
const gHeight = 60; // 55 w/ boxDimensions * 2
const grid = new NodeGrid(gHeight, gWidth, scene, { x: 0 + nodeWidth / 2, y: 0 - nodeWidth / 2, z: floorHeight }, nodeWidth);


const playAreaPlaneGeometry = new THREE.PlaneGeometry(nodeWidth * gWidth, nodeWidth * gHeight, 1, 1);
const playAreaPlaneMesh = new THREE.MeshStandardMaterial();
playAreaPlaneMesh.color = new THREE.Color(0xdbdbdb);
const playAreaPlane = new THREE.Mesh(playAreaPlaneGeometry, playAreaPlaneMesh);
playAreaPlane.castShadow = false;
playAreaPlane.receiveShadow = true;
console.log(playAreaPlane.geometry.computeBoundingBox());
const playAreaPlaneSize = playAreaPlane.geometry.boundingBox.getSize();
console.log(playAreaPlaneSize);
playAreaPlane.position.set(0 + playAreaPlaneSize.x / 2, 0 - playAreaPlaneSize.y / 2, floorHeight - 1);
scene.add(playAreaPlane);

function getRandomPosition() {
    let minX = 1;
    let maxX = gWidth * nodeWidth - 20;
    let minY = -1;
    let maxY = -(gHeight - 2) * nodeWidth;

    let randX = Math.floor(Math.random() * (maxX - minX + 1) + minX);
    let randY = Math.floor(Math.random() * (maxY - minY + 1) + minY);

    return { x: randX, y: randY, z: 0 };
}

let topLeft = {
    x: Math.round(-canvas.clientWidth / 2),
    y: Math.round(canvas.clientHeight / 2),
};

// POINT LIGHT
const light1 = gui.addFolder('Light 1');

const pointLight = new THREE.PointLight(0xffffff, 0.2)
pointLight.position.set(0, 0, 40);
light1.add(pointLight.position, 'x').min(-500).max(500).step(0.001);
light1.add(pointLight.position, 'y').min(-500).max(500).step(0.001);
light1.add(pointLight.position, 'z').min(1).max(115).step(0.01);
light1.add(pointLight, 'intensity').min(0).max(10).step(0.01);
pointLight.position.set(630, -292, 200);

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
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);
// scene.add(pointLightHelper);

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
camera.position.set(630, -292, 190); // 190, -65, 150

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


    // place wall
    if (ctrl) {
        lastMouseNode = grid.getNode(pos);
        if (lastMouseNode.wall == null) lastMouseNode.addWall();
        else lastMouseNode.removeWall();

        console.log(lastMouseNode.walkable);
    }
    // add entity into the arena where clicked
    else {
        console.log(groups[selectedEntityIndex]);
        const group = groups[selectedEntityIndex];
        const size = group.size;
        let beats = [];
        let loses = [];

        // getting all entities from beats
        for (let i = 0; i < group.beats.length; i++) {
            for (let j = 0; j < group.beats[i].members.length; j++) {
                beats.push(group.beats[i].members[j]);
            }
        }

        // getting all entities from loses
        for (let i = 0; i < group.loses.length; i++) {
            for (let j = 0; j < group.loses[i].members.length; j++) {
                loses.push(group.loses[i].members[j]);
            }
        }

        let newEntity = new SquareAI(group.color, { width: size, height: size, depth: size }, 
            pos, scene, group.speed, grid, beats, loses, group.id);
        group.members.push(newEntity);
        console.log(group);
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
    if (ctrl) {
        let node = grid.getNode(pos);
        if (lastMouseNode != node && mouseDown && ctrl) {
            lastMouseNode = node;
            if (node.wall == null) node.addWall();
            else node.removeWall();
        }
    }
});

document.getElementById("floatButton").addEventListener("click", function () {
    console.log("Starting...");
    groups.forEach(e => {
        e.members.forEach(e => {
            // console.log(e.group.position);
            e.updatePathingGrid();
        });
    });

    simStarted = true;
});

var p = false;
var up = false, down = false, left = false, right = false; // WASD
var aUp = false, aDown = false, aLeft = false, aRight = false; // arrow keys
var zoomOut = false, zoomIn = false;
var ctrl = false;

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

const moveCamera = () => {
    if (zoomIn) camera.position.z -= speed * delta;
    if (zoomOut) camera.position.z += speed * delta;
    if (p) console.log(camera.position);

    if (up) camera.position.y += speed * delta;
    if (left) camera.position.x -= speed * delta;
    if (down) camera.position.y -= speed * delta;
    if (right) camera.position.x += speed * delta;
}

// hiden side nav
document.getElementById('sidenav-header-minimize').addEventListener("click", function () {

    sideNavMaximizeButton.style.visibility = "visible";
    canvasContainer.style.marginLeft = "0%";
    sideBar.style.visibility = "hidden";
    entitySelector.style.visibility = "hidden";
});

// show side nav
document.getElementById('sidenav-header-maximize-button').addEventListener("click", function () {
    sideNavMaximizeButton.style.visibility = "hidden";
    sideBar.style.visibility = "visible";
    entitySelector.style.visibility = "visible";
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

    moveCamera();

    if (simStarted) {
        groups.forEach(e => {
            e.members.forEach(e => {
                e.tryMove();
            });
        });
    
        if (elapsedTime >= pathUpdateInterval) {
            groups.forEach(e => {
                e.members.forEach(e => {
                    e.updatePath();
                });
            });
        }
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();