import data from '../interface/gameData';

function update() {
	if (data.ball.x >= 1.0)
		data.ball.direction = -0.03;
	if (data.ball.x <= -1.0)
		data.ball.direction = 0.03;
	data.ball.x += data.ball.direction;

	if (data.keyPress.up) {
		data.paddle.y += 0.03;
	} else if (data.keyPress.down) {
		data.paddle.y -= 0.03;
	} else {
		data.paddle.y += 0;
	}

	// 패들 위치 제한
	if (data.paddle.y - data.paddle.height / 2.0 < -1.0) {
		data.paddle.y = -1.0 + data.paddle.height / 2.0;
	}
	if (data.paddle.y + data.paddle.height / 2.0 > 1.0)
		data.paddle.y = 1.0 - data.paddle.height / 2.0;
}

export default update;