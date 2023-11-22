import data from '../interface/gameData';
import PhysicsEngine from "../class/PhysicsEngine";
import { GameManager } from "../class/GameManager";

function update(delta: number) {
	/* 공 위치 업데이트 */
	PhysicsEngine.GuaranteeConflict(data.ball, delta);
	/* 공이 라인을 넘어가는지 확인 */
	const player = GameManager.checkOverLine(data.ball.position);
	/* 공이 라인을 넘어갔다면 점수 업데이트 */
	if (player !== '')
		GameManager.scoreUpdate(player);
	/* 게임 종료 조건 확인 */
	if (GameManager.isMatchConcluded()) {
		/* 임시 초기화, 게임 종료 조건 추가 */
		GameManager.resetGame();
	}
	/* 공이 위, 아래 벽을 넘어가는지 확인 */
	PhysicsEngine.handleBallWallCollision();
	/* player 패들 이동 */
	PhysicsEngine.updatePaddlePosition(delta);
}

export default update;