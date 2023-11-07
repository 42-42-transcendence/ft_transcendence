import data from '../interface/gameData';
import { vec2 } from 'gl-matrix';

function update() {
	const ball = data.ball;

	vec2.add(ball.position, ball.position, ball.velocity);
	if (ball.position[0] + ball.radius > 1.0 || ball.position[0] - ball.radius < -1.0) {
		ball.velocity[0] *= -1;
	}
	if (ball.position[1] + ball.radius > 1.0 || ball.position[1] - ball.radius < -1.0) {
		ball.velocity[1] *= -1;
	}

	const paddle = data.paddle;
	if (data.keyPress.up) {
		paddle.position[1] += 0.03;
	} else if (data.keyPress.down) {
		paddle.position[1] -= 0.03;
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