import * as THREE from 'three';
import Entity from './entity';

export default class Node extends Entity {
    // color - Node is automatically black
    // size = {width, height, depth}
    // position = {x, y, z}
    constructor(size, pos) {
        super(0x000000, size, pos);

        const aiGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const aiMaterial = new THREE.MeshBasicMaterial();
        aiMaterial.wireframe = true;
        aiMaterial.color = new THREE.Color(0x000000);

        this.renderObj = new THREE.Mesh(aiGeometry, aiMaterial);
        this.renderObj.name = "node";
        this.renderObj.position.x = pos.x;
        this.renderObj.position.y = pos.y;
        this.renderObj.position.z = pos.z;
        this.renderObj.visible = true; // should be false

        this.walkable = true;

    }
}