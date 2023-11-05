function shader (gl : WebGLRenderingContext) {
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
            console.error('ERROR creating vertex shader!');
            return ;
        }
        gl.shaderSource(vertexShader, vsGLSL);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
            return ;
        }

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragmentShader) {
            console.error('ERROR creating fragment shader!');
            return ;
        }
        gl.shaderSource(fragmentShader, fsGLSL);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
            return ;
        }

        const shaderProgram = gl.createProgram();
        if (!shaderProgram) {
            console.error('ERROR creating shader program!');
            return ;
        }
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('ERROR linking program!', gl.getProgramInfoLog(shaderProgram));
            return ;
        }

        gl.detachShader(shaderProgram, vertexShader);
        gl.deleteShader(vertexShader);
        gl.detachShader(shaderProgram, fragmentShader);
        gl.deleteShader(fragmentShader);

        const positionLoc = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        gl.useProgram(shaderProgram);

		return positionLoc;
}

export default shader;