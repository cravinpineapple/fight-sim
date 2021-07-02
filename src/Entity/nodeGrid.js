import Node from './node.js';

export default class NodeGrid {
    // color = 0x000000
    // size = {width, height, depth}
    // position = {x, y, z}

    constructor(gridHeight, gridWidth, scene, pos, nodeWidth) {
        this.nodeWidth = nodeWidth;
        this.gridHeight = gridHeight;
        this.gridWidth = gridWidth;
        this.scene = scene;

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
                this.grid[i][j] = new Node({ width: nodeWidth, height: nodeWidth, depth: 0.005 }, tempPos, { row: i, col: j, id: idCount }, scene);
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
                    neighbors.push({ row: i - 1, col: j }); // top

                    if (j > 0) {
                        neighbors.push({ row: i - 1, col: j - 1 }); // top left
                    }
                    if (j < this.grid[i].length - 2) {
                        neighbors.push({ row: i - 1, col: j + 1 }); // top right
                    }
                }

                if (i <= this.grid.length - 2) {
                    neighbors.push({ row: i + 1, col: j }); // bottom

                    if (j > 0) {
                        neighbors.push({ row: i + 1, col: j - 1 }); // bottom left
                    }
                    if (j < this.grid[i].length - 2) {
                        neighbors.push({ row: i + 1, col: j + 1 }); // bottom right
                    }
                }

                if (j > 0) {
                    neighbors.push({ row: i, col: j - 1 }); // left
                }

                if (j < this.grid[i].length - 2) {
                    neighbors.push({ row: i, col: j + 1 }); // right
                }



                this.grid[i][j].neighborCords = neighbors;
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