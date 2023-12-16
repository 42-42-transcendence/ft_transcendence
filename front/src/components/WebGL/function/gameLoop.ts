import data from '../interface/gameData';
import { render } from './render';
import update from "./update";
import receive from "./receive";

export function gameLoop(timeStamp: number) {
	if (data.endGame) {
		cancelAnimationFrame(data.requestId);
		return;
	}
	let delta = (timeStamp - data.lastTime) / 1000.0;
	// if (timeStamp < data.lastTime + (1000 / 10)) {
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