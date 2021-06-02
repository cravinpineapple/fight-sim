import * as THREE from 'three';
import Entity from './entity';

export default class SquareAI extends Entity {
    // color = 0x000000
    // size = {width, height, depth}
    // position = {x, y, z}
    constructor(color, size, pos, scene, speed) {
        super(color, size, pos, scene, speed);

        const aiGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const aiMaterial = new THREE.MeshBasicMaterial();
        aiMaterial.color = new THREE.Color(color);
        aiMaterial.wireframe = true;

        this.renderObj = new THREE.Mesh(aiGeometry, aiMaterial);
        this.renderObj.name = "aisquare";
        this.group.position.x = pos.x;
        this.group.position.y = pos.y;
        this.group.position.z = pos.z;
        this.group.add(this.renderObj);

        // currentNodeRay
        this.addCurrentNodeRay(this.group.position);

        // adding rays to object
        this.addRay(this.group.position, new THREE.Vector3(0, 1, 0)); // up
        this.addRay(this.group.position, new THREE.Vector3(1, 1, 0)); // up right
        this.addRay(this.group.position, new THREE.Vector3(1, 0, 0)); // right
        this.addRay(this.group.position, new THREE.Vector3(1, -1, 0)); // down right
        this.addRay(this.group.position, new THREE.Vector3(0, -1, 0)); // down 
        this.addRay(this.group.position, new THREE.Vector3(-1, -1, 0)); // down left
        this.addRay(this.group.position, new THREE.Vector3(-1, 0, 0)); // left
        this.addRay(this.group.position, new THREE.Vector3(-1, 1, 0)); // up left


        // let vertices = this.renderObj.geometry.attributes.position.array;
        // for (let i = 0; i < vertices.length; i += 3) {
        //     let vertex = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
        //     let currPos = this.renderObj.position;
        //     let temp = new THREE.Vector3();
            
        //     console.log(vertex);
        //     this.addRay(currPos, temp.subVectors(currPos, vertex).normalize());
        // }
    }
}