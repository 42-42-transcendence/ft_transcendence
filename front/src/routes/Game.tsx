import {SocketContextProvider} from "../components/WebGL/context/SocketContext";
import GameLogic from './GameLogic';

const GamePage = () => {
    return (
        <main>
            <SocketContextProvider>
                <GameLogic />
            </SocketContextProvider>
        </main>
    );
};

export default GamePage;
