import data from '../interface/gameData';
import { render } from './render';
import update from "./update";

export function gameLoop(timeStamp: number) {
	let delta = (timeStamp - data.lastTime) / 1000.0;
	// if (timeStamp < data.lastTime + (1000 / 120)) {
	// 	requestAnimationFrame(gameLoop);
	// 	return;
	// }
	render();
	// s docket.emit('update', delta, update);
	update(delta);
	data.lastTime = timeStamp;
	requestAnimationFrame(gameLoop);
}

export default gameLoop;