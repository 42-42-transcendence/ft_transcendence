import { Socket, io } from 'socket.io-client';
import { createContext, useContext, useEffect, useState } from 'react';
import useAuthState from '../store/Auth/useAuthState';
import { SERVER_URL } from '../App';

type SocketContextType = {
    socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

type ChildProps = {
    children: React.ReactNode;
};

const SocketContextProvider = ({ children }: ChildProps) => {
    const authState = useAuthState();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!socket) {
            const newSocket = io(SERVER_URL, {
                auth: {
                    token: authState.token,
                },
                query: {
                    userID: authState.myID,
                },
            });

            // 확인차 출력
            newSocket.on('connect', () => {
                console.log('connected socket');
            });

            newSocket.on('disconnect', () => {
                console.log('disconnected socket');
                setSocket(null);
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
    const ctx = useContext(SocketContext);

    return ctx;
};

export { SocketContextProvider, useSocket };
export default SocketContext;