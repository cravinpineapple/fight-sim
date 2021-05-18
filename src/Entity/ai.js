import * as THREE from 'three';
import Entity from './entity';

export default class SquareAI extends Entity {
    constructor(color, size, position) {
        super(color, size, position);
        // color = 0x000000
        // size = {width, height, depth}
        // position = {x, y, z}

        const aiGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const aiMaterial = new THREE.MeshBasicMaterial();
        aiMaterial.color = new THREE.Color(color);

        this.renderObj = new THREE.Mesh(aiGeometry, aiMaterial);
    }
}