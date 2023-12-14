import {io, Socket} from 'socket.io-client';
import {SERVER_URL} from "../../../App";
import useAuthState from "../../../store/Auth/useAuthState";
import {useDispatch} from "react-redux";
import React, {createContext, useContext, useEffect, useState} from "react";
import data, {gameDataFromServer} from "../interface/gameData";
import useUserState from "../../../store/User/useUserState";
import {GameManager} from "../class/GameManager";

type SocketContextType = {
    socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

type ChildProps = {
    children: React.ReactNode;
};

const SocketContextProvider = ({ children }: ChildProps) => {
    const userState = useUserState();
    const authState = useAuthState();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!socket) {
            const newSocket = io(`${SERVER_URL}/game`, {
                auth: {
                    token: authState.token,
                },
                query: {
                    userID: userState.id,
                },
            });

            newSocket.on('updateGame', (gameData: any) => {
                gameDataFromServer.height[0] = gameData.height[0];
                gameDataFromServer.height[1] = gameData.height[1];
                gameDataFromServer.paddlePos[0][0] = gameData.paddlePos[0][0];
                gameDataFromServer.paddlePos[0][1] = gameData.paddlePos[0][1];
                gameDataFromServer.paddlePos[1][0] = gameData.paddlePos[1][0];
                gameDataFromServer.paddlePos[1][1] = gameData.paddlePos[1][1];
                gameDataFromServer.ballPos[0] = gameData.ballPos[0];
                gameDataFromServer.ballPos[1] = gameData.ballPos[1];
                gameDataFromServer.itemsPos = gameData.itemsPos;
                console.log("data received......");
            });

            newSocket.on('endGame', () => {
                data.endGame = true;
            });

            newSocket.on('scoreUpdate', (score: number[]) => {
                data.scores[0] = score[0];
                data.scores[1] = score[1];
                GameManager.scoreUpdate(null);
            });


            setSocket(newSocket);
        }

        return () => {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        };
    }, [socket, authState]);

    return (
        <SocketContext.Provider value={{ socket }}>
        {children}
        </SocketContext.Provider>
    );
};

const useSocket = () => {
    return useContext(SocketContext);
};

export { SocketContextProvider, useSocket };