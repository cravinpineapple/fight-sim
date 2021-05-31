import * as THREE from 'three';

export default class Entity {
    // color = 0x000000
    // size = {width, height, depth}
    // position = {x, y, z}
    constructor(color, size, position, scene, speed) {
        this.debugMode = true;
        this.scene = scene;
        this.entityID = this.id++;
        this.color = color;
        this.size = size;
        this.position = position;
        this.renderObj = null;
        this.rays = [];
        this.currentNodeRay = null;
        this.speed = speed;

        // group for line helpers and render object
        this.group = new THREE.Group();
    }
    // static id = 0;

    // line information 
    //  lineInfo = {pointsPath, lineLength, fraction}
    move(lineInfo) {
        // get point along line
        const newPos = lineInfo.pointsPath.getPoint(lineInfo.fraction);
        // move ai to that point
        this.copyPos(newPos);

        lineInfo.fraction += (0.5 / lineInfo.lineLength) * this.speed;
        if (lineInfo.fraction > 1) {
            lineInfo.pointsPath = null;
        }
    }

    // vector = {x, y, z}
    copyPos(vector) {
        this.position.x = vector.x;
        this.position.y = vector.y;
        this.position.z = vector.z;

        this.group.position.copy(vector);
    }

    checkCollision() {
        var intersections = [];

        for (let i = 0; i < this.rays.length; i++) {
            intersections.push(this.rays[i].intersectObjects(this.scene.children));
        }

        for (let i = 0; i < intersections.length; i++) {
            for (let j = 0; j < intersections[i].length; j++) {
                if (intersections[i][j].object.name == "playersquare") {
                    intersections[i][j].object.material.color.set(0xffff00);
                    this.speed = 0;
                }
            }
        }
    }

    // origin (vector3) = {x, y, z}
    // direction (vector3) = {x, y, z}
    addRay(origin, direction) {
        const far = this.size.width; // this.size.width / 2
        const raycaster = new THREE.Raycaster(origin, direction, 0, far);
        this.rays.push(raycaster);

        // testing
        if (this.debugMode) {
            // for some reason, the origin is relative to the center of the group.
            const arrowHelper = new THREE.ArrowHelper(direction, new THREE.Vector3(0, 0, 0), far, 0x00FF00);
            // this.scene.add(arrowHelper);
            this.group.add(arrowHelper);
        }
    }

    addCurrentNodeRay(origin) {
        const far = 1;
        const direction = new THREE.Vector3(0, 1, 0);
        this.currentNodeRay = new THREE.Raycaster(origin, direction, 0, far);

        // testing
        if (this.debugMode) {
            // for some reason, the origin is relative to the center of the group.
            const arrowHelper = new THREE.ArrowHelper(direction, new THREE.Vector3(0, 0, 0), far, 0x00FFFF);
            // this.scene.add(arrowHelper);
            this.group.add(arrowHelper);
        }
    }


}