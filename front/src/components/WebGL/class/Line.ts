export class Line {
    lineSize = 0.04;
    lineVertices = new Float32Array([
        -this.lineSize, 1,
        this.lineSize, 1,
        -this.lineSize, -1,

        this.lineSize, 1,
        -this.lineSize, -1,
        this.lineSize, -1,
    ]);
}
export default Line;