import data from '../interface/gameData';

function shader () {
	const gl = data.gl as WebGLRenderingContext;

	const vsGLSL = `
            attribute vec4 aVertexPosition;

            void main(void) {
                gl_Position = aVertexPosition;
            }
        `;
        const fsGLSL = `
            precision highp float;

            void main(void) {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `;
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertexShader) {
            throw new Error('ERROR creating vertex shader!');
        }
        gl.shaderSource(vertexShader, vsGLSL);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            throw new Error('ERROR compiling vertex shader!' + gl.getShaderInfoLog(vertexShader));
        }

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragmentShader) {
            throw new Error('ERROR creating fragment shader!');
        }
        gl.shaderSource(fragmentShader, fsGLSL);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            throw new Error('ERROR compiling fragment shader!' + gl.getShaderInfoLog(fragmentShader));
        }

        const shaderProgram = gl.createProgram();
        if (!shaderProgram) {
            throw new Error('ERROR creating shader program!');
        }
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            throw new Error('ERROR linking program!' + gl.getProgramInfoLog(shaderProgram));
        }

        gl.detachShader(shaderProgram, vertexShader);
        gl.deleteShader(vertexShader);
        gl.detachShader(shaderProgram, fragmentShader);
        gl.deleteShader(fragmentShader);

        data.positionLoc = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
		if (data.positionLoc === -1) {
			throw new Error('Shader error');
		}
        gl.useProgram(shaderProgram);
}

export default shader;