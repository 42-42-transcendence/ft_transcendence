// import data from '../interface/gameData';
// import { vec2 } from 'gl-matrix';

// function update(delta: number) {
// 	const ball = data.ball;
// 	const paddle = data.paddle;

// 	vec2.add(ball.position, ball.position, vec2.scale(vec2.create(), ball.direction, ball.velocity * delta));

// 	/* 패들 & 공 충돌 감지 */
// 	for (let i = 0; i < 2; i++) {
// 		let paddleTop = paddle[i].position[1] + paddle[i].height / 2.0;
// 		let paddleBottom = paddle[i].position[1] - paddle[i].height / 2.0;
// 		let paddleLeft = paddle[i].position[0] - paddle[i].width / 2.0;
// 		let paddleRight = paddle[i].position[0] + paddle[i].width / 2.0;

// 		const BallTop = ball.position[1] + ball.radius;
// 		const BallBottom = ball.position[1] - ball.radius;
// 		const BallLeft = ball.position[0] - ball.radius;
// 		const BallRight = ball.position[0] + ball.radius;

// 		if (BallTop > paddleBottom && BallBottom < paddleTop && BallLeft < paddleRight && BallRight > paddleLeft) {
// 			let normalReflect = vec2.fromValues(i == 0 ? 1 : -1, 0); // 왼쪽 패들이면 1, 오른쪽 패들이면 -1
// 			normalReflect[1] = (ball.position[1] - paddle[i].position[1]) / paddle[i].height * 3.0;
// 			if (i === 0 && BallLeft < paddle[i].position[0] || i === 1 && BallRight > paddle[i].position[0])
// 				normalReflect[0] *= -1;
// 			vec2.normalize(ball.direction, normalReflect);
// 		}
// 	}

// 	/* 공이 라인을 넘어가는지 확인 */
// 	if (ball.position[0] + ball.radius > 1.0 || ball.position[0] - ball.radius < -1.0) {
// 		if (ball.position[0] + ball.radius > 1.0) {
// 			if (!data.scoreRef[0]) return;
// 			data.scoreRef[0].innerText = String(++data.scores[0]);
// 		} else {
// 			if (!data.scoreRef[1]) return;
// 			data.scoreRef[1].innerText = String(++data.scores[1]);
// 		}
// 		ball.position[0] = 0;
// 		ball.position[1] = 0;
// 		ball.direction = vec2.fromValues(1.0, 0);
// 	}

// 	if (data.scores[0] === 5 || data.scores[1] === 5) {
// 		// 게임 종료 조건.
// 	}

// 	/* 공이 위, 아래 벽을 넘어가는지 확인 */
// 	if (ball.position[1] + ball.radius > 1.0 || ball.position[1] - ball.radius < -1.0) {
// 		ball.direction[1] *= -1; // 위, 아래 벽에 닿을 경우 공의 반사를 구현 (정반사)
// 	}

// 	/* player1 패들 이동 */
// 	if (data.keyPress.up) {
// 		paddle[0].position[1] += paddle[0].paddleSpeed * delta
// 	} else if (data.keyPress.down) {
// 		paddle[0].position[1] -= paddle[0].paddleSpeed * delta;
// 	} else {
// 		paddle[0].position[1] += 0;
// 	}

//     // 위치 제한?

// 	/* 패들 위치 제한 */
// 	if (paddle[0].position[1] - paddle[0].height / 2.0 < -1.0) {
// 		paddle[0].position[1] = -1.0 + paddle[0].height / 2.0;
// 	}
// 	if (paddle[0].position[1] + paddle[0].height / 2.0 > 1.0)
// 		paddle[0].position[1] = 1.0 - paddle[0].height / 2.0;
// }

// export default update;