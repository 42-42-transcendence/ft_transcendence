import data from '../interface/gameData';
import PhysicsEngine from "../class/PhysicsEngine";
import { GameManager } from "../class/GameManager";
import { AIManager } from "../class/AIManager";
import { ItemManager } from '../class/ItemManager';

function update(delta: number) {
	if (data.mode === 'object') {
	// 	/* 아이템 생성 */
		ItemManager.getInstance().createItem();
	// 	/* 아이템 업데이트 */
		ItemManager.getInstance().updateItems(delta);
	}
	/* 공 위치 업데이트 */
	PhysicsEngine.GuaranteeConflict(data.ball, delta);
	/* 게임 종료 조건 확인 */
	AIManager.getInstance().GuaranteeConflict(data.ball.clone(), 10000);
	/* player 패들 이동 */
	data.paddle[0].updatePosition(delta);
	data.paddle[1].updatePosition(delta);
	if (GameManager.isMatchConcluded()) {
		GameManager.endGame();
	}
}

export default update;