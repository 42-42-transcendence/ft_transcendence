import data from '../interface/gameData';
import { render } from './render';
import update from "./update";
import receive from "./receive";
import { useSocket } from "../context/SocketContext";
import { GameManager } from "../class/GameManager";

export function gameLoop(timeStamp: number) {
	const { socket } = useSocket();
	if (data.endGame) {
		socket?.disconnect();
		cancelAnimationFrame(data.requestId);
		GameManager.cleanupWebGL();
		data.isFirstRender = true;
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