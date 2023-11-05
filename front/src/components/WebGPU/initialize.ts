export const initWebGL = async (canvas : HTMLCanvasElement) => {
	let gl: WebGLRenderingContext | null = null;

    /* 브라우저에서 WebGL를 사용할 수 있는지 확인 */
	gl = canvas.getContext("webgl") as WebGLRenderingContext;
	if (!gl) {
		throw new Error("No appropriate WebGL context found.");
	}
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	/* WebGL을 사용할 수 있다면, WebGLRenderingContext를 반환 */
	return gl;
};
