import {gameDataFromServer} from "../interface/gameData";
import data from "../interface/gameData";

function receive() {
    data.paddle[0].position[1] = gameDataFromServer.paddlePos[0][1];
    data.paddle[1].position[1] = gameDataFromServer.paddlePos[1][1];
    data.ball.position = gameDataFromServer.ballPos;
    data.paddle[0].height = gameDataFromServer.height[0];
    data.paddle[1].height = gameDataFromServer.height[1];
}

export default receive;