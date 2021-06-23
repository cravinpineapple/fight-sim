import * as THREE from 'three';
import { GridHelper } from 'three';
import Entity from './entity';
import NodeGrid from './nodeGrid.js';

export default class Wall extends Entity {
    // color = 0x000000
    // size = {width, height, depth}
    // position = {x, y, z}
    constructor(color, size, pos) {
        super(color, size, pos, null, 0);

        const wallGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const wallMaterial = new THREE.MeshBasicMaterial();
        wallMaterial.color = new THREE.Color(color);
        wallMaterial.wireframe = false;

        this.renderObj = new THREE.Mesh(wallGeometry, wallMaterial);
        this.renderObj.name = "wall";
        this.renderObj.position.set(pos.x, pos.y, pos.z);
    }
}