import * as THREE from 'three';
import Entity from './entity';

export default class SquareAI extends Entity {
        // color = 0x000000
        // size = {width, height, depth}
        // position = {x, y, z}
    constructor(color, size, pos) {
        super(color, size, pos);

        const aiGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const aiMaterial = new THREE.MeshBasicMaterial();
        aiMaterial.color = new THREE.Color(color);

        this.renderObj = new THREE.Mesh(aiGeometry, aiMaterial);
        this.renderObj.position.x = pos.x;
        this.renderObj.position.y = pos.y;
        this.renderObj.position.z = pos.z;

    }
}