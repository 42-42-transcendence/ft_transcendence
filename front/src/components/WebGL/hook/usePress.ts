import data from '../interface/gameData';
import { useEffect } from 'react';

function usePress() {

	function keyDownHandler(event : KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      data.keyPress.up = true;
    } else if (event.key === 'ArrowDown') {
      data.keyPress.down = true;
    }
	}

	function keyUpHandler(event : KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      data.keyPress.up = false;
    } else if (event.key === 'ArrowDown') {
      data.keyPress.down = false;
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