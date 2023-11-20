import {vec2} from "gl-matrix";

class Item {
    position: vec2;
    radius: number;
    constructor(x: number, y: number, radius: number) {
        this.position = vec2.fromValues(x, y);
        this.radius = radius;
    }
}
export default Item;