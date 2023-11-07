let data: gameData = {
	paddle: {
		x: -0.85, // 시작 위치 X
		y: 0, // 시작 위치 Y
		width: 0.1, // 패들의 폭
		height: 0.3, // 패들의 높이
	},
	ball: {
		x: 0, // 시작 위치 X
		y: 0, // 시작 위치 Y
		radius: 0.03, // 공의 반지름
		direction: 0.03, // 공의 방향
	},
	keyPress: {
		up: false,
		down: false,
	},
	gl: null,
	paddleBuffer: null,
	ballBuffer: null,
	positionLoc: 0,
	lastTime: 0,
};

export default data;