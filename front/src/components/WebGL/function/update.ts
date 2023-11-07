import data from '../interface/gameData';
import { vec2 } from 'gl-matrix';

function update() {
	const ball = data.ball;
	const paddle = data.paddle;

	const paddleTop = paddle.position[1] + paddle.height / 2.0;
	const paddleBottom = paddle.position[1] - paddle.height / 2.0;
	const paddleLeft = paddle.position[0] - paddle.width / 2.0;
	const paddleRight = paddle.position[0] + paddle.width / 2.0;

	const ballTop = ball.position[1] + ball.radius;
	const ballBottom = ball.position[1] - ball.radius;
	const ballLeft = ball.position[0] - ball.radius;
	const ballRight = ball.position[0] + ball.radius;

	if (ballTop > paddleBottom && ballBottom < paddleTop && ballLeft < paddleRight && ballRight > paddleLeft) {
		let normalReflect = vec2.fromValues(1, 0);
		normalReflect[1] = (ball.position[1] - paddle.position[1]) / paddle.height * 3.0;

		vec2.normalize(ball.direction, normalReflect);
	}

	vec2.add(ball.position, ball.position, vec2.scale(vec2.create(), ball.direction, ball.velocity));
	if (ball.position[0] + ball.radius > 1.0 || ball.position[0] - ball.radius < -1.0) {
		ball.direction[0] *= -1; // 후에 게임오버 조건으로 변경
	}
	if (ball.position[1] + ball.radius > 1.0 || ball.position[1] - ball.radius < -1.0) {
		ball.direction[1] *= -1; // 위, 아래 벽에 닿을 경우 공의 반사를 구현 (정반사)
	}


	if (data.keyPress.up) {
		paddle.position[1] += paddle.paddleSpeed;
	} else if (data.keyPress.down) {
		paddle.position[1] -= paddle.paddleSpeed;
	} else {
		paddle.position[1] += 0;
	}

	// 패들 위치 제한
	if (paddle.position[1] - paddle.height / 2.0 < -1.0) {
		paddle.position[1] = -1.0 + paddle.height / 2.0;
	}
	if (paddle.position[1] + paddle.height / 2.0 > 1.0)
		paddle.position[1] = 1.0 - paddle.height / 2.0;
}

export default update;