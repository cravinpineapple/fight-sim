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
                // reset neighbors
                
                // getting neighbors

                // if (i != 0 && i != this.grid.length - 2 && j != 1 && j != this.grid[i].length - 2) {
                //     
                //     neighbors.push(this.grid[i + 1][j - 1]); // bottom left
                //     neighbors.push(this.grid[i + 1][j + 1]); // bottom right
                // }

                tempPos = {
                    x: pos.x + nodeWidth * j,
                    y: pos.y + nodeWidth * -i,
                    z: pos.z,
                }
                this.grid[i][j] = new Node({width: nodeWidth, height: nodeWidth, depth: 0.005}, tempPos);
                scene.add(this.grid[i][j].renderObj);
            }
        }
        
        let neighbors = [];
        // add neighbors too all nodes
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                neighbors = [];

                if (i > 0) {
                    neighbors.push(this.grid[i - 1][j]); // top

                    if (j > 0) {
                        neighbors.push(this.grid[i - 1][j - 1]); // top left
                    } 
                    if (j < this.grid[i].length - 2) {
                        neighbors.push(this.grid[i - 1][j + 1]); // top right
                    }
                }

                if (i <= this.grid.length - 2) {
                    neighbors.push(this.grid[i + 1][j]); // bottom

                    if (j > 0) {
                        neighbors.push(this.grid[i + 1][j - 1]); // bottom left
                    } 
                    if (j < this.grid[i].length - 2) {
                        neighbors.push(this.grid[i + 1][j + 1]); // bottom right
                    }
                }

                if (j > 0) {
                    neighbors.push(this.grid[i][j - 1]); // left
                } 

                if (j < this.grid[i].length - 2) {
                    neighbors.push(this.grid[i][j + 1]); // right
                }



                this.grid[i][j].neighbors = neighbors;
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

    getPath(currNode, goalNode) {
        var queue = new PriorityQueue({comparator: function(a, b) {return b - a}});

        // currNode
    }


    calcHeuristic(currNode, goalNode) {
        const D = 10; // non-diagonal move cost
        const D2 = 14; // diagonal move cost
    
        let dx = Math.abs(currNode.renderObj.position.x - goalNode.renderObj.position.x);
        let dy = Math.abs(currNode.renderObj.position.y - goalNode.renderObj.position.y);
    
        return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
    }
}