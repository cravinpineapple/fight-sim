import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


const boxDimensions = 50;
// Objects
const geometry = new THREE.BoxGeometry(boxDimensions, boxDimensions, boxDimensions);

// Materials

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)
// material.

// Mesh
const sphere = new THREE.Mesh(geometry,material)
const testObj1 = gui.addFolder('Test Obj 1');

sphere.position.x = 0;
sphere.position.y = 0;
sphere.position.z = -250;

testObj1.add(sphere.position, 'x').step(0.5);
testObj1.add(sphere.position, 'y').step(0.5);
testObj1.add(sphere.position, 'z').step(2);

// const pointLightHelper = new THREE.PointLightHelper(pointLight2, 0.3);
// scene.add(pointLightHelper);
scene.add(sphere)

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
var speed = 1;

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
    if (up) sphere.position.y += speed * delta;
    if (left) sphere.position.x -= speed * delta;
    if (down) sphere.position.y -= speed * delta;
    if (right) sphere.position.x += speed * delta;
}

var lastUpdate = Date.now();
// var myInterval = setInterval(tick, 0);

const update = (delta) => {
    
}

const tick = () =>
{

    // const elapsedTime = clock.getElapsedTime()
    var now = Date.now();
    delta = now - lastUpdate;
    lastUpdate = now;

    movement();

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // update(delta)
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()