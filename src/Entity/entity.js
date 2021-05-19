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
}