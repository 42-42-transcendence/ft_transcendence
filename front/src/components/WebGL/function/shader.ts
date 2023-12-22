import data from '../interface/gameData';

function shader () {
	const gl = data.gl;
    if (!gl)
        return;

	const vsGLSL = `
            attribute vec4 aVertexPosition;

            void main(void) {
                gl_Position = aVertexPosition;
            }
        `;
    const fsGLSL = `
            precision mediump float;
            uniform vec4 u_Color;
            
            void main(void) {
                gl_FragColor = u_Color;
            }
        `;
    const lineFsGLSL = `
        precision mediump float;
        uniform vec2 viewportDimensions;

        void main() {
            float scale = 10.0; // 점선의 밀도를 조정
            float pattern = fract(gl_FragCoord.y * scale / viewportDimensions.y);
            if (pattern < 0.42) {
                discard;
            }
        gl_FragColor = vec4(1, 1, 1, 1);
    }
    `;
    /* shader */
    // shader 참조 변수 생성
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) {
        return;
    }
    // 위에서 선언한 변수에 작성한 shader 할당
    gl.shaderSource(vertexShader, vsGLSL);
    // 할단한 shader 컴파일 (해당 작업은 GPU에서 일어남)
    gl.compileShader(vertexShader);
    // shader의 상태를 볼 때 사용된다. compile_status 즉, 컴파일이 제대로 완료됐는지 확인
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
    // shdaer 프로그램 객체 생성
    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
        throw new Error('ERROR creating shader program!');
    }
    data.program[0] = shaderProgram;
    // shader 첨부
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    // shader 프로그램을 GPU 메모리에 복사 (linking)
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error('ERROR linking program!' + gl.getProgramInfoLog(shaderProgram));
    }
    // 이전에 attach 한 것을 해제 (아래에서 delete 해주기에 사실은 불필요)
    gl.detachShader(shaderProgram, vertexShader);
    // GPU로 복사를 마쳤기 때문에 더 이상 불필요한 shader 삭제
    gl.detachShader(shaderProgram, fragmentShader);
    gl.deleteShader(fragmentShader);
    // shaderProgram에 저장된 변수의 위치 반환
     data.positionLoc = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
     if (data.positionLoc === -1) {
         throw new Error('Shader error');
     }
    // GPU에서 관리하는 attribute 변수를 활성화
    gl.enableVertexAttribArray(data.positionLoc);
    data.uColorLocation = gl.getUniformLocation(data.program[0]!, 'u_Color');
    data.program[1] = gl.createProgram();
    if (!data.program[1]) {
        throw new Error('ERROR creating shader program!');
    }
    const fragmentShaderEx = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShaderEx) {
        throw new Error('ERROR creating fragment shader!');
    }
    gl.shaderSource(fragmentShaderEx, lineFsGLSL);
    gl.compileShader(fragmentShaderEx);
    if (!gl.getShaderParameter(fragmentShaderEx, gl.COMPILE_STATUS)) {
        throw new Error('ERROR compiling fragment shader!' + gl.getShaderInfoLog(fragmentShader));
    }
    gl.attachShader(data.program[1], vertexShader);
    gl.attachShader(data.program[1], fragmentShaderEx);
    gl.linkProgram(data.program[1]);
    if (!gl.getProgramParameter(data.program[1], gl.LINK_STATUS)) {
        throw new Error('ERROR linking program!' + gl.getProgramInfoLog(data.program[1]));
    }
    gl.detachShader(data.program[1] ,vertexShader);
    gl.deleteShader(vertexShader);
    gl.detachShader(data.program[1], fragmentShaderEx);
    gl.deleteShader(fragmentShaderEx);
    data.viewPortLoc = gl.getUniformLocation(data.program[1], "viewportDimensions");
}

export default shader;