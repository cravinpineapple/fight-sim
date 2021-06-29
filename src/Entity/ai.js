import * as THREE from 'three';
import { GridHelper } from 'three';
import Entity from './entity';
import NodeGrid from './nodeGrid.js';

export default class SquareAI extends Entity {
    // color = 0x000000
    // size = {width, height, depth}
    // position = {x, y, z}
    constructor(color, size, pos, scene, speed, gridRef) {
        super(color, size, pos, scene, speed);

        const aiGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const aiMaterial = new THREE.MeshBasicMaterial();
        aiMaterial.color = new THREE.Color(color);
        aiMaterial.wireframe = true;

        this.gridRef = gridRef;

        this.pathingGrid = null;
        this.updatePathingGrid();
        
        this.currentPath = [];
        this.lineInfo = {
            fraction: 0,
            pointsPath: null,
            lineLength: 0,
        };

        // line path for testing
        this.visualLinePath = null
        this.pathLineVisible = true;


        // entities this entity beats
        this.preys = [];
        // entities this entity loses to 
        this.predators = [];


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

        scene.add(this.group);
    }

    updatePathingGrid() {
        this.pathingGrid = new Array(this.gridRef.gridHeight);
        for (let i = 0; i < this.pathingGrid.length; i++) {
            this.pathingGrid[i] = new Array(this.gridRef.gridWidth);
            for (let j = 0; j < this.pathingGrid[i].length; j++) {
                let n = this.gridRef.grid[i][j];
                this.pathingGrid[i][j] = {
                    row: i,
                    col: j,
                    id: n.id,
                    pos: {
                        x: n.renderObj.position.x,
                        y: n.renderObj.position.y,
                        z: n.renderObj.position.z,
                    },
                    gval: 0,
                    fval: 0,
                    hval: 0,
                    parent: null,
                    walkable: n.walkable,
                    neighborCords: this.getNeighborCords(n),
                };
            }
        }
    }

    // for creating pathingGrid in constructor
    getNeighborCords(node) {
        let neighborCords = [];
        for (let i = 0; i < node.neighborCords.length; i++) {
            neighborCords.push({ row: node.neighborCords[i].row, col: node.neighborCords[i].col });
        }
        return neighborCords;
    }

    getCenter() {
        return new THREE.Vector3(this.group.position.x + (this.size.width / 2), this.group.position.y - (this.size.height / 2), 0
        );
    }

    getCenterForPath() {
        return new THREE.Vector3(this.group.position.x, this.group.position.y, 0
        );
    }

    highlightNodePath(isHighlighted) {
        const pathColor = isHighlighted ? new THREE.Color(0x32CD32) : new THREE.Color(0x000000);

        this.currentPath.forEach(e => this.gridRef.grid[e.row][e.col].renderObj.material.color = pathColor);
    }

    buildFollowPath() {
        // remove old line

        // if no path found, return
        if (this.currentPath.length == 0) {
            console.log("path not reachable");
            this.lineInfo.pointsPath = null;
            return;
        } 

        if (this.pathLineVisible) this.scene.remove(this.visualLinePath);

        // if (this.lineInfo == null) {
        //     return;
        // };

        let tempPointsPath = new THREE.CurvePath();

        if (this.currentPath.length == 1) {
            const p1 = this.getCenterForPath();
            const p2 = this.gridRef.grid[this.currentPath[0].row][this.currentPath[0].col].getCenter();

            const line = new THREE.LineCurve3(
                p1,
                p2,
            );
            tempPointsPath.add(line);
        }
        else {
            for (let i = 1; i < this.currentPath.length; i++) {
                const p1 = i == 1 ? this.getCenterForPath() : this.gridRef.grid[this.currentPath[i - 1].row][this.currentPath[i - 1].col].getCenter();
                const p2 = this.gridRef.grid[this.currentPath[i].row][this.currentPath[i].col].getCenter();

                const line = new THREE.LineCurve3(
                    p1,
                    p2,
                );
                tempPointsPath.add(line);
            }
        }

        const lineLengths = tempPointsPath.getCurveLengths();

        this.lineInfo.fraction = 0;
        this.lineInfo.lineLength = lineLengths[lineLengths.length - 1];
        this.lineInfo.pointsPath = tempPointsPath;

        if (this.pathLineVisible) {
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFF69B4 });
            const points = this.lineInfo.pointsPath.curves.reduce((p, d) => [...p, ...d.getPoints(20)], []);
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            this.visualLinePath = new THREE.Line(lineGeometry, lineMaterial);
            this.scene.add(this.visualLinePath);
        }
    }

    // returns the node of the closest prey
    getClosestPreyNode() {
        if (this.preys.length == 0)
            return null;

        let startNode = this.gridRef.getNode(this.getCenter());

        let closestNode = this.gridRef.getNode(this.preys[0].getCenter());
        let closestNum = this.calcHeuristic(startNode, closestNode);

        for (let i = 1; i < this.preys.length; i++) {
            let newClosestNode = this.gridRef.getNode(this.preys[i].getCenter());
            let newClosestNum = this.calcHeuristic(startNode, newClosestNode);
            if (newClosestNum < closestNum) {
                closestNode = newClosestNode;
                closestNum = newClosestNum;
            }
        }

        return closestNode;
    }

    calcHeuristic(currNode, goalNode) {
        const D = 10; // non-diagonal move cost
        const D2 = 14; // diagonal move cost

        let dx = Math.abs(currNode.pos.x - goalNode.pos.x);
        let dy = Math.abs(currNode.pos.y - goalNode.pos.y);

        return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
    }

    tryMove() {
        if (this.lineInfo.pointsPath == null) {
            return
        }

        if (this.lineInfo.pointsPath != null)
            this.move(this.lineInfo);
        else
            this.lineInfo.fraction = 0;
    }

    updatePath() {
        let closestPrey = this.getClosestPreyNode();
        let closestPreyNode = this.gridRef.getNode(closestPrey.position);
        if (!this.pathingGrid[closestPreyNode.row][closestPreyNode.col].walkable) {
            return;
        }
        this.getPath(closestPrey);
        this.buildFollowPath();
    }

    getPath(end) {
        let start = this.gridRef.getNode(this.getCenter());
        let currNode = this.pathingGrid[start.row][start.col];
        let goalNode = this.pathingGrid[end.row][end.col];
        let open = [currNode];
        let closed = [];

        // list of changed nodes so we can reset them when goal node found
        let changed = [currNode];

        let current;
        let count = 0;
        while (true) {
            current = open[0];

            open.splice(0, 1);
            closed.push(current);


            if (current == null) return [];
            
            if (current.id == goalNode.id) {
                let path = [current];
                current = current.parent;
                let count = 0;

                while (current != null) {
                    count++;
                    if (count > 100) return;
                    path.splice(0, 0, current);
                    current = current.parent;
                }

                // resetting affected nodes
                for (let i = 0; i < changed.length; i++) {
                    this.pathingGrid[changed[i].row][changed[i].col].gval = 0;
                    this.pathingGrid[changed[i].row][changed[i].col].fval = 0;
                    this.pathingGrid[changed[i].row][changed[i].col].hval = 0;
                    this.pathingGrid[changed[i].row][changed[i].col].parent = null;
                }

                this.currentPath = path;
                return;
            }

            // for each neighbor of current
            for (let i = 0; i < current.neighborCords.length; i++) {
                let n = this.pathingGrid[current.neighborCords[i].row][current.neighborCords[i].col];

                if (!n.walkable || closed.includes(n)) {
                    continue;
                }

                changed.push({ row: current.neighborCords[i].row, col: current.neighborCords[i].col });

                let costToNeighbor = current.gval + this.calcHeuristic(current, n);

                if (costToNeighbor < n.gval || !open.includes(n)) {
                    n.gval = costToNeighbor
                    n.hval = this.calcHeuristic(n, goalNode);
                    n.fval = n.gval + n.hval;
                    n.parent = current;

                    if (!open.includes(n)) {
                        // inserts n depending on it's fval
                        if (open.length == 0) {
                            open.push(n);
                        }
                        else {
                            let adding = true;
                            for (let i = 0; i < open.length && adding; i++) {
                                if (n.fval < open[i].fval) {
                                    open.splice(i, 0, n);
                                    adding = false;
                                }
                                else if (i == open.length - 1) {
                                    open.push(n);
                                    adding = false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}