import data from '../interface/gameData';
import { render } from './render';
import update from "./update";

export function gameLoop(timeStamp: number) {
	let delta = (timeStamp - data.lastTime) / 1000.0;
	// if (timeStamp < data.lastTime + (1000 / 30)) {
	// 	requestAnimationFrame(gameLoop);
	// 	return;
	// }
	update(delta);
	render();
	data.lastTime = timeStamp;
	console.log(data.ball.position[0], data.ball.position[1]);
	data.requestId = requestAnimationFrame(gameLoop);
}

export default gameLoop;