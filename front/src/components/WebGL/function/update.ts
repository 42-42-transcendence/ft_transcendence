import data from '../interface/gameData';
import { vec2 } from 'gl-matrix';

function update(delta: number) {
	const ball = data.ball;
	const paddle = data.paddle;

	let paddleTop = paddle[0].position[1] + paddle[0].height / 2.0;
	let paddleBottom = paddle[0].position[1] - paddle[0].height / 2.0;
	let paddleLeft = paddle[0].position[0] - paddle[0].width / 2.0;
	let paddleRight = paddle[0].position[0] + paddle[0].width / 2.0;

	const ballTop = ball.position[1] + ball.radius;
	const ballBottom = ball.position[1] - ball.radius;
	const ballLeft = ball.position[0] - ball.radius;
	const ballRight = ball.position[0] + ball.radius;

	/* player 1 충돌 감지 */
	if (ballTop > paddleBottom && ballBottom < paddleTop && ballLeft < paddleRight && ballRight > paddleLeft) {
		let normalReflect = vec2.fromValues(1, 0);
		normalReflect[1] = (ball.position[1] - paddle[0].position[1]) / paddle[0].height * 3.0;
		if (ballRight < paddle[0].position[0])
			normalReflect[0] *= -1;
		vec2.normalize(ball.direction, normalReflect);
	}

	/* player 2 충돌 감지 */
	paddleTop = paddle[1].position[1] + paddle[1].height / 2.0;
	paddleBottom = paddle[1].position[1] - paddle[1].height / 2.0;
	paddleLeft = paddle[1].position[0] - paddle[1].width / 2.0;
	paddleRight = paddle[1].position[0] + paddle[1].width / 2.0;

	if (ballTop > paddleBottom && ballBottom < paddleTop && ballRight > paddleLeft && ballLeft < paddleRight) {
		let normalReflect = vec2.fromValues(-1, 0);
		normalReflect[1] = (ball.position[1] - paddle[1].position[1]) / paddle[1].height * 3.0;
		if (ballRight > paddle[1].position[0])
			normalReflect[0] *= -1;
		vec2.normalize(ball.direction, normalReflect);
	}

	/* 공이 라인을 넘어가는지 확인 */
	vec2.add(ball.position, ball.position, vec2.scale(vec2.create(), ball.direction, ball.velocity * delta));
	if (ball.position[0] + ball.radius > 1.0 || ball.position[0] - ball.radius < -1.0) {
		if (ball.position[0] + ball.radius > 1.0) {
			if (!data.scoreRef[0]) return;
			data.scoreRef[0].innerText = String(++data.scores[0]);
		} else {
			if (!data.scoreRef[1]) return;
			data.scoreRef[1].innerText = String(++data.scores[1]);
		}
		ball.position[0] = 0;
		ball.position[1] = 0;
		ball.direction = vec2.fromValues(1.0, 0);
	}

	if (data.scores[0] === 5 || data.scores[1] === 5) {
		// 게임 종료 조건.
	}

	/* 공이 위, 아래 벽을 넘어가는지 확인 */
	if (ball.position[1] + ball.radius > 1.0 || ball.position[1] - ball.radius < -1.0) {
		ball.direction[1] *= -1; // 위, 아래 벽에 닿을 경우 공의 반사를 구현 (정반사)
	}

	/* player1 패들 이동 */
	if (data.keyPress.up) {
		paddle[0].position[1] += paddle[0].paddleSpeed * delta
	} else if (data.keyPress.down) {
		paddle[0].position[1] -= paddle[0].paddleSpeed * delta;
	} else {
		paddle[0].position[1] += 0;
	}

	/* 패들 위치 제한 */
	if (paddle[0].position[1] - paddle[0].height / 2.0 < -1.0) {
		paddle[0].position[1] = -1.0 + paddle[0].height / 2.0;
	}
	if (paddle[0].position[1] + paddle[0].height / 2.0 > 1.0)
		paddle[0].position[1] = 1.0 - paddle[0].height / 2.0;
}

export default update;