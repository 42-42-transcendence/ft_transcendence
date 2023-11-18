import { Socket, io } from 'socket.io-client';
import { createContext, useContext, useEffect, useState } from 'react';

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

type ChildProps = {
  children: React.ReactNode;
};

const SocketContextProvider = ({ children }: ChildProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socket) {
      const newSocket = io('http://localhost:3001/');

      // 확인차 출력
      newSocket.on('connect', () => {
        console.log('connected socket');
      });

      setSocket(newSocket);
    }
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [socket]);

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
