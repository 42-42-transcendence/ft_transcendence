import data from '../interface/gameData';
import { render } from './render';
import update from "./update";
import receive from "./receive";
import { GameManager } from "../class/GameManager";

export function gameLoop(timeStamp: number) {
	if (data.endGame) {
		cancelAnimationFrame(data.requestId);
		data.isFirstRender = true;
		GameManager.cleanupWebGL();
		window.dispatchEvent(new CustomEvent('gameEnd', {}));
		return;
	}
	let delta = (timeStamp - data.lastTime) / 1000.0;
	if (data.mode === 'AI')
		update(delta);
	else
		receive();
	render();
	data.lastTime = timeStamp;
	data.requestId = requestAnimationFrame(gameLoop);
}

export default gameLoop;