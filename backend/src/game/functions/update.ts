import { ItemManager } from '../dto/ItemManager';
import { GameManager } from '../dto/GameManager';
import PhysicsEngine from '../dto/PhysicsEngine';
import { gamedata } from '../dto/in-game.dto';


function update(delta: number) {
	// if (data.mode === 'object') {
	// 	/* 아이템 생성 */
	// 	ItemManager.getInstance().createItem();
	// 	/* 아이템 업데이트 */
	// 	ItemManager.getInstance().updateItems(delta);
	// }
	/* 공 위치 업데이트 */
	PhysicsEngine.GuaranteeConflict(gamedata.ball, delta);
	/* 게임 종료 조건 확인 */
	// AIManager.getInstance().GuaranteeConflict(gamedata.ball.clone(), 10000);
	// AIManager.getInstance().testPlayer1(); // 테스트용
	/* player 패들 이동 */
	gamedata.paddle[0].updatePosition(delta);
	gamedata.paddle[1].updatePosition(delta);
	if (GameManager.isMatchConcluded()) {
		/* 임시 초기화, 게임 종료 조건 추가 */
		GameManager.endGame();
	}
}

export default update;