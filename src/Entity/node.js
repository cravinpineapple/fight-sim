import * as THREE from 'three';
import Entity from './entity';
import Wall from './wall';

export default class Node extends Entity {
    // color - Node is automatically black
    // size = {width, height, depth}
    // position = {x, y, z}
    constructor(size, pos, nodeInfo, scene) {
        super(0x000000, size, pos, scene);

        const nodeGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const nodeMaterial = new THREE.MeshBasicMaterial();
        nodeMaterial.wireframe = true;
        nodeMaterial.color = new THREE.Color(0x000000);

        this.renderObj = new THREE.Mesh(nodeGeometry, nodeMaterial);
        this.renderObj.name = "node";
        this.renderObj.position.x = pos.x;
        this.renderObj.position.y = pos.y;
        this.renderObj.position.z = pos.z;
        this.pos = {
            x: pos.x,
            y: pos.y,
            z: pos.z,
        }
        this.renderObj.visible = false; // should be false

        this.row = nodeInfo.row;
        this.col = nodeInfo.col;
        this.id = nodeInfo.id;

        // A* Stuff
        // this.fval = 0;
        this.gval = Number.POSITIVE_INFINITY;
        this.hval = Number.POSITIVE_INFINITY;
        this.fval = Number.POSITIVE_INFINITY;
        this.neighborCords = null;
        this.walkable = true;
        this.parent = null;

        this.wall = null;
    }

    addWall() {
        this.wall = new Wall(this.renderObj.material.color, 
            { width: this.size.width, 
            height: this.size.height, 
            depth: this.size.height},
            {x: this.position.x,
            y: this.position.y,
            z: this.position.z + (this.size.width / 2)});
        this.scene.add(this.wall.renderObj);
        this.walkable = false;
    }

    removeWall() {
        this.scene.remove(this.wall.renderObj);
        this.wall = null;
        this.walkable = true;
    }

    getCenter() {
        return new THREE.Vector3(this.renderObj.position.x, this.renderObj.position.y, 0
        );
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

// TODO: Do pathing to goal node
// TODO: Do pathing to moving target
// TODO: Create obstacles