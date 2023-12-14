import data from '../interface/gameData';
import { render } from './render';
import update from "./update";
import receive from "./receive";

export function gameLoop(timeStamp: number) {
	if (data.endGame) {
		cancelAnimationFrame(data.requestId);
		return;
	}
	console.log(data.ball.position[0], data.ball.position[1]);
	let delta = (timeStamp - data.lastTime) / 1000.0;
	// if (timeStamp < data.lastTime + (1000 / 30)) {
	// 	requestAnimationFrame(gameLoop);
	// 	return;
	// }
	if (data.mode === 'AI')
		update(delta);
	else
		receive();
	render();
	data.lastTime = timeStamp;
	data.requestId = requestAnimationFrame(gameLoop);
}

export default gameLoop;