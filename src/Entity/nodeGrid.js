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
        let idCount = 0;
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                tempPos = {
                    x: pos.x + nodeWidth * j,
                    y: pos.y + nodeWidth * -i,
                    z: pos.z,
                }
                this.grid[i][j] = new Node({width: nodeWidth, height: nodeWidth, depth: 0.005}, tempPos, {row: i, col: j, id: idCount});
                scene.add(this.grid[i][j].renderObj);
                idCount++;
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

    // getDistance(nodeA, nodeB) {
    //     let dx = Math.abs(nodeA.col - nodeB.col);
    //     let dy = Math.abs(nodeA.row - nodeB.row);

    //     if (dx > dy) return 14 * dy + 10 * (dx - dy);

    //     return 14 * dx + 10 * (dy - dx);
    // }

    getPath(start, end) {
        // var open = new PriorityQueue({comparator: function(a, b) {return b.fval - a.fval}});
        // open.queue(currNode);
        let gridCopy = this.grid;
        let currNode = gridCopy[start.row][start.col];
        let goalNode = gridCopy[end.row][end.col];
        let open = [currNode];
        let closed = [];


        let current;
        let count = 0;
        while (true) {
            // console.log(open);
            current = open[0];
            open.splice(0, 1);
            closed.push(current);

            if (current == goalNode) {
                console.log("goal found");
                // return [];
                let path = [current];
                console.log(current);
                current = current.parent;
                while (current != null) {
                    path.push(current);
                    current = current.parent;
                    console.log(current);
                }

                return path;
            }

            // for each neighbor or current
            for (let i = 0; i < current.neighbors.length; i++) {
                let n = current.neighbors[i];

                if (!n.walkable || closed.includes(n)) {
                    continue;
                }

                let costToNeighbor = current.gval + this.calcHeuristic(current, n);

                if (costToNeighbor < n.gval || !open.includes(n)) {
                    n.gval = costToNeighbor
                    n.hval = this.calcHeuristic(n, goalNode);
                    n.fval = costToNeighbor + n.hval;
                    n.parent = current;
                    
                    if (!open.includes(n)) {
                        // inserts n depending on it's fval
                        if (open.length == 0) {
                            open.push(n);
                        }
                        else {
                            for (let i = 0; i < open.length; i++) {
                                if (n.fval < open[i].fval) {
                                    open.splice(i, 0, n);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    calcHeuristic(currNode, goalNode) {
        const D = 10; // non-diagonal move cost
        const D2 = 14; // diagonal move cost
    
        let dx = Math.abs(currNode.renderObj.position.x - goalNode.renderObj.position.x);
        let dy = Math.abs(currNode.renderObj.position.y - goalNode.renderObj.position.y);
    
        return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
    }
}