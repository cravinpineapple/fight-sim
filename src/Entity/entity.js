export default class Entity {
    constructor(color, size, position) {
        this.entityID = this.id++;
        this.color = color;
        this.size = size;
        this.position = position;
        this.renderObj = null;
        // throw new Error("Cannot create an instance of an abstract class");
    }
    // static id = 0;

    // line information 
    //  lineInfo = {pointsPath, lineLength, fraction}
    move(lineInfo) {
        // get point along line
        const newPos = lineInfo.pointsPath.getPoint(lineInfo.fraction);
        // move ai to that point
        this.copyPos(newPos);

        lineInfo.fraction += 0.5 / lineInfo.lineLength;
        if (lineInfo.fraction > 1) {
            lineInfo.pointsPath = null;
        }
    }

    // vector = {x, y, z}
    copyPos(vector) {
        this.position.x = vector.x;
        this.position.y = vector.y;
        this.position.z = vector.z;

        this.renderObj.position.copy(vector);
    }
}