import './style.css'
import * as THREE from 'three'
import SquareAI from './Entity/ai.js';
import NodeGrid from './Entity/nodeGrid.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GridHelper } from 'three';

const GROUND = -250

// Debug
const gui = new dat.GUI()
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()



// making floor
const planeGeometry = new THREE.PlaneGeometry(500, 500, 1, 1);
const planeMesh = new THREE.MeshStandardMaterial();
planeMesh.color = new THREE.Color(0x808080);
const plane = new THREE.Mesh(planeGeometry, planeMesh);
plane.castShadow = false;
plane.receiveShadow = true;
// plane.rotation.x = -Math.PI / 2;
plane.position.set(0, 0, 0);
scene.add(plane);



const boxDimensions = 5;
// Objects
const geometry = new THREE.BoxGeometry(boxDimensions, boxDimensions, boxDimensions);
// creating AI
var aiPosition = {
    x: 50,
    y: 75,
    z: 0,
};

var aiSize = {
    width: boxDimensions,
    height: boxDimensions,
    depth: boxDimensions,
};

//aiMaterial
const aiMaterial = new THREE.MeshBasicMaterial();
aiMaterial.color = new THREE.Color(0x0000ff);
let aiSquare = new SquareAI(0x00ffff, aiSize, aiPosition);

// playerMaterials
const playerMaterial = new THREE.MeshBasicMaterial();
playerMaterial.color = new THREE.Color(0xff0000);
const playerSquare = new THREE.Mesh(geometry, playerMaterial)
playerSquare.castShadow = true;

const testObj1 = gui.addFolder('Player Object');

let grid = new NodeGrid(16, 31, scene, { x: -605, y: 425, z: GROUND }, boxDimensions);

// PLAYER
playerSquare.position.set(0, 0, 0);

// AI 
testObj1.add(playerSquare.position, 'x').step(0.5);
testObj1.add(playerSquare.position, 'y').step(0.5);
testObj1.add(playerSquare.position, 'z').step(2);


console.log(aiSquare.renderObj);
console.log(playerSquare);
scene.add(playerSquare)
scene.add(aiSquare.renderObj);

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
camera.position.set(0, 0, 150); // 0, 0, 0

const perpCam = gui.addFolder('Orth Cam 1');

perpCam.add(camera.position, 'x').step(0.5);
perpCam.add(camera.position, 'y').step(0.5);
perpCam.add(camera.position, 'z').step(0.5);
scene.add(camera)
camera.lookAt(playerSquare.position);

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

const clock = new THREE.Clock()

var delta;
var speed = 0.05;

var up = false, down = false, left = false, right = false;

document.onkeydown = () => {
    var e = e || window.event;
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
}

document.onkeyup = () => {
    var e = e || window.event;
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
}

const movement = () => {
    if (up) playerSquare.position.y += speed * delta;
    if (left) playerSquare.position.x -= speed * delta;
    if (down) playerSquare.position.y -= speed * delta;
    if (right) playerSquare.position.x += speed * delta;
}

var lastUpdate = Date.now();
// var myInterval = setInterval(tick, 0);

function buttonClick() {
    playerSquare.material.color.setHex(Math.random() * 0xffffff);
    aiSquare.renderObj.material.color.setHex(Math.random() * 0xffffff);
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
var vec = new THREE.Vector3();
var pos = new THREE.Vector3();
// convert click cords to Three.js 3D coordinates
canvas.addEventListener("click", (e) => {
    vec.set((e.clientX / canvas.clientWidth) * 2 - 1, - (e.clientY / canvas.clientHeight) * 2 + 1, 0.5);
    vec.unproject(camera);
    vec.sub(camera.position).normalize();

    var distance = - camera.position.z / vec.z;

    pos.copy(camera.position).add(vec.multiplyScalar(distance));

    console.log(pos);
});

const tick = () => {
    resizeCanvasToDiv();
    // const elapsedTime = clock.getElapsedTime()
    var now = Date.now();
    delta = now - lastUpdate;
    lastUpdate = now;

    movement();

    // Update objects
    // playerSquare.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // update(delta)
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick();