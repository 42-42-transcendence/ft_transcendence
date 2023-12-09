import { gamedata } from "../dto/in-game.dto";
import {vec2} from 'gl-matrix';
import {Ball} from '../dto/Ball';

function initialize(state: any) {
	gamedata.ball = new Ball(vec2.fromValues(0, 0), vec2.fromValues(1.0, 0), 2.0, 0.02);
	if (state.gameMode === 'fast') {
		gamedata.ball.velocity = 3.0;
		gamedata.paddle[0].paddleSpeed = 1.5;
		gamedata.paddle[1].paddleSpeed = 1.5;
	} else if (state.gameMode === 'object') {
		gamedata.ball.velocity = 1.5;
		gamedata.paddle[0].paddleSpeed = 1.0;
		gamedata.paddle[1].paddleSpeed = 1.0;
	}
}

export default initialize;