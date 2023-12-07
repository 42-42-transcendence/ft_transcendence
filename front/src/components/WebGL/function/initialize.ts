import data from '../interface/gameData';
import {gameDataFromServer} from "../interface/gameData";
import {Paddle} from '../class/Paddle';
import {vec2} from 'gl-matrix';
import {Ball} from '../class/Ball';
import { useSocket } from '../../../socket/SocketContext';
import {GameManager} from "../class/GameManager";

const { socket } = useSocket();

function initialize(state: any) {
	if (data.canvasRef === null || socket === null) return;
	data.gl = data.canvasRef.getContext('webgl');
	if (!data.gl) {
		throw new Error('WebGL not supported');
	}

	data.gl.clearColor(0.0, 0.0, 0.0, 1.0);

	data.paddleBuffer = data.gl.createBuffer() as WebGLBuffer;
	data.ballBuffer = data.gl.createBuffer() as WebGLBuffer;
	data.lineBuffer = data.gl.createBuffer() as WebGLBuffer;

	data.scores = [0, 0];
	data.paddle = [new Paddle(-0.96, 0), new Paddle(0.96, 0)];
	if (data.profileRef[0] && data.profileRef[1] && state && state.player) {
		data.profileRef[0].innerHTML = state.player[0];
		data.profileRef[1].innerHTML = state.player[1];
		data.mode = state.gameMode;
	}

	data.lastTime = performance.now();
	data.endGame = false;

	data.ball = new Ball(vec2.fromValues(0, 0), vec2.fromValues(1.0, 0), 2.0, 0.02);
	if (state.gameMode !== 'object') {
		data.ball.velocity = 3.0;
		data.paddle[0].speed = 1.5;
		data.paddle[1].speed = 1.5;
	} else {
		data.ball.velocity = 1.5;
		data.paddle[0].speed = 1.0;
		data.paddle[1].speed = 1.0;
	}

	socket.on('updateData', (gameData: any) => {
		gameDataFromServer.height[0] = gameData.height[0];
		gameDataFromServer.height[1] = gameData.height[0];
		gameDataFromServer.paddlePos[0][0] = gameData.paddlePos[0][0];
		gameDataFromServer.paddlePos[0][1] = gameData.paddlePos[0][1];
		gameDataFromServer.paddlePos[1][0] = gameData.paddlePos[1][0];
		gameDataFromServer.paddlePos[1][1] = gameData.paddlePos[1][1];
		gameDataFromServer.ballPos[0] = gameData.ballPos[0];
		gameDataFromServer.ballPos[1] = gameData.ballPos[1];
	});

	socket.on('endGame', () => {
		data.endGame = true;
	});

	socket.on('startGame', () => {
		data.endGame = false;
	});

	socket.on('scoreUpdate', (score: number[]) => {
		data.scores[0] = score[0];
		data.scores[1] = score[1];
		GameManager.scoreUpdate(null);
	});
}

export default initialize;