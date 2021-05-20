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


const boxDimensions = 50;
// Objects
const geometry = new THREE.BoxGeometry(boxDimensions, boxDimensions, boxDimensions);

// playerMaterials
const playerMaterial = new THREE.MeshBasicMaterial();
playerMaterial.color = new THREE.Color(0xff0000);

//aiMaterial
const aiMaterial = new THREE.MeshBasicMaterial();
aiMaterial.color = new THREE.Color(0x0000ff);

// creating AI
var aiPosition = {
    x: 555, 
    y: 75, 
    z: GROUND,
};

var aiSize = {
    width: boxDimensions,
    height: boxDimensions,
    depth: boxDimensions,
};

let aiSquare = new SquareAI(0x00ffff, aiSize, aiPosition);
// let nodeSquare = new Node(aiSize, {x: -605, y: 425, z: GROUND});
let grid = new NodeGrid(16, 31, scene, {x: -605, y: 425, z: GROUND}, boxDimensions);


// Mesh
const playerSquare = new THREE.Mesh(geometry,playerMaterial)
const testObj1 = gui.addFolder('Player Object');

// PLAYER
playerSquare.position.x = -395;
playerSquare.position.y = 75;
playerSquare.position.z = GROUND;

// AI 
testObj1.add(playerSquare.position, 'x').step(0.5);
testObj1.add(playerSquare.position, 'y').step(0.5);
testObj1.add(playerSquare.position, 'z').step(2);


console.log(aiSquare.renderObj);
console.log(playerSquare);
scene.add(playerSquare)
scene.add(aiSquare.renderObj);
// adding all Nodes from NodeGrid
// for (let i = 0; i < grid.grid.length; i++) {
//     for (let j = 0; j < grid.grid[i].length; i++) {
//         scene.add(grid.grid[i][j]);
//     }
// }

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 0
pointLight.position.y = 2
pointLight.position.z = 40
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

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
const camera = new THREE.OrthographicCamera(-aspectRatio * viewSize / 2, aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2, 1, 1000 );//(500, 500, 500, 500, -300, 1000 );
camera.position.set(0, 0, 0);

const orthCam1 = gui.addFolder('Orth Cam 1');

orthCam1.add(camera.position, 'x').step(0.5);
orthCam1.add(camera.position, 'y').step(0.5);
orthCam1.add(camera.position, 'z').step(0.5);
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

const clock = new THREE.Clock()

var delta;
var speed = 0.2;

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
    playerSquare.material.color.setHex( Math.random() * 0xffffff );
    aiSquare.renderObj.material.color.setHex( Math.random() * 0xffffff );
}

document.getElementById("changeColor").addEventListener("click", buttonClick);

const tick = () =>
{

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

tick()