import * as THREE from 'three';
import Entity from './entity';
import Node from './node.js';

export default class NodeGrid {
        // color = 0x000000
        // size = {width, height, depth}
        // position = {x, y, z}
    constructor(gridHeight, gridWidth, scene, pos, nodeWidth) {
        this.nodeWidth = nodeWidth;
        this.gridHeight = gridHeight;
        this.gridWidth = gridWidth;

        // create 2d array 
        this.grid = new Array(gridHeight);
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = new Array(gridWidth);
        }

        let tempPos;
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                tempPos = {
                    x: pos.x + nodeWidth * j,
                    y: pos.y + nodeWidth * -i,
                    z: pos.z,
                }
                this.grid[i][j] = new Node({width: nodeWidth, height: nodeWidth, depth: nodeWidth}, tempPos);
                scene.add(this.grid[i][j].renderObj);
            }
        } 
    }

    // vector = {x, y, z}
    //  gets node from give position
    getNode(vector) {
        let x = Math.floor(vector.x / this.nodeWidth);
        let y = Math.floor(Math.abs(vector.y / this.nodeWidth));
        return this.grid[y][x];
    }
}