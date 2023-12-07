import data from '../interface/gameData';
import { useEffect } from 'react';
import { useSocket } from '../../../socket/SocketContext';

const { socket } = useSocket();

function usePress() {
	function keyDownHandler(event : KeyboardEvent) {
		if (socket === null) {
			console.error('socket is null');
			return;
		}

		if (event.key === 'ArrowUp') {
			if (data.mode === 'AI')
				data.paddle[0].keyPress.up = true;
			else
				socket.emit('UpKey'); // 인자 없이 요청
			} else if (event.key === 'ArrowDown') {
			if (data.mode === 'AI')
				data.paddle[0].keyPress.down = true;
			else
				socket.emit('DownKey'); // 인자 없이 요청
			}
		}

	function keyUpHandler(event : KeyboardEvent) {
		if (socket === null) {
			console.error('socket is null');
			return;
		}

		if (event.key === 'ArrowUp') {
			if (data.mode === 'AI')
				data.paddle[0].keyPress.up = false;
			else
				socket.emit('KeyRelease'); // 인자 없이 요청
			data.paddle[0].keyPress.up = false;
		} else if (event.key === 'ArrowDown') {
			if (data.mode === 'AI')
				data.paddle[0].keyPress.down = false;
			else
				socket.emit('KeyRelease'); // 인자 없이 요청
		}
	}

	useEffect(() => {
	  window.addEventListener('keydown', keyDownHandler);
	  window.addEventListener('keyup', keyUpHandler);
		return () => {
			window.removeEventListener('keydown', keyDownHandler);
			window.removeEventListener('keyup', keyUpHandler);
		}
	}, []);
}

  export default usePress;