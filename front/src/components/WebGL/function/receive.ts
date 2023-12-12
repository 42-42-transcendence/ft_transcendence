import {gameDataFromServer} from "../interface/gameData";
import {ItemManager} from "../class/ItemManager";
import data from "../interface/gameData";

function receive() {
    data.paddle[0].position[0] = gameDataFromServer.paddlePos[0][0];
    data.paddle[0].position[1] = gameDataFromServer.paddlePos[0][1];
    data.paddle[1].position[0] = gameDataFromServer.paddlePos[1][0];
    data.paddle[1].position[1] = gameDataFromServer.paddlePos[1][1];
    data.ball.position = gameDataFromServer.ballPos;
    data.paddle[0].height = gameDataFromServer.height[0];
    data.paddle[1].height = gameDataFromServer.height[1];
    if (gameDataFromServer.itemsPos && gameDataFromServer.itemsPos.length > 0) {
        for (let i = 0; i < gameDataFromServer.itemsPos.length; i++) {
            ItemManager.getInstance().items[i].position = gameDataFromServer.itemsPos[i];
        }
    }
}

export default receive;