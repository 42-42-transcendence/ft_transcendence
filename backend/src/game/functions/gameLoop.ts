import { gamedata } from '../dto/in-game.dto';
import update from "./update";

export function gameLoop(timeStamp: number) {
	let delta = (timeStamp - gamedata.lastTime) / 1000.0;
	if (timeStamp < gamedata.lastTime + (1000 / 50)) {
		requestAnimationFrame(gameLoop);
		return;
	}
	update(delta);
	gamedata.lastTime = timeStamp;
}

export default gameLoop;