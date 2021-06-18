import * as THREE from 'three';
import Entity from './entity';

export default class Node extends Entity {
    // color - Node is automatically black
    // size = {width, height, depth}
    // position = {x, y, z}
    constructor(size, pos, nodeInfo) {
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

        this.row = nodeInfo.row;
        this.col = nodeInfo.col;
        this.id = nodeInfo.id; 

        // A* Stuff
        // this.fval = 0;
        this.gval = 0;
        this.hval = 0;
        this.neighbors = null;
        this.walkable = true;
        this.parent = null;
    }

    // bool isHighlighted
    highlight(isHighlighted) {
        const nodeColor = isHighlighted ? new THREE.Color(0x00FFFF) : new THREE.Color(0x000000);
        const neighborColor = isHighlighted ? new THREE.Color(0xFFFF00) : new THREE.Color(0x000000);
        
        // un/highlight current node
        this.renderObj.material.color = nodeColor;
        // un/highlight neighbors
        console.log(this.neighbors.length);
        this.neighbors.forEach(e => e.renderObj.material.color = neighborColor);
    }
}