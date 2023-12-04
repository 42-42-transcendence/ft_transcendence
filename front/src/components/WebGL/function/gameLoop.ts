import data from '../interface/gameData';
import { render } from './render';
import update from "./update";

export function gameLoop(timeStamp: number) {
	if (data.endGame) {
		cancelAnimationFrame(data.requestId);
		return;
	}
	let delta = (timeStamp - data.lastTime) / 1000.0;
	console.log(data.requestId);
	// if (timeStamp < data.lastTime + (1000 / 30)) {
	// 	requestAnimationFrame(gameLoop);
	// 	return;
	// }
	render();
	update(delta);
	data.lastTime = timeStamp;
	console.log(data.ball.position[0], data.ball.position[1]);
	data.requestId = requestAnimationFrame(gameLoop);
}

export default gameLoop;