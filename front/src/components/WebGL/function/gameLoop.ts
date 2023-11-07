import data from '../interface/gameData';
import { render } from './render';
import update from "./update";

export function gameLoop(timeStamp: number) {
	// 60 프레임으로 고정
	if (timeStamp < data.lastTime + (1000 / 60)) {
		requestAnimationFrame(gameLoop);
		return;
	}
	render();
	update();
	data.lastTime = timeStamp;
	requestAnimationFrame(gameLoop);
}

export default gameLoop;