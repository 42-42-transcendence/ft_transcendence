import data from '../interface/gameData';
import { useEffect } from 'react';

function usePress() {

	function keyDownHandler(event : KeyboardEvent) {
		if (event.key === 'ArrowUp') {
		  data.paddle[0].keyPress.up = true;
		} else if (event.key === 'ArrowDown') {
			data.paddle[0].keyPress.down = true;
		}
	}

	function keyUpHandler(event : KeyboardEvent) {
		if (event.key === 'ArrowUp') {
			data.paddle[0].keyPress.up = false;
		} else if (event.key === 'ArrowDown') {
			data.paddle[0].keyPress.down = false;
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