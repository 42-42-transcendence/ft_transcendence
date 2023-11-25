import { Socket, io } from 'socket.io-client';
import { createContext, useContext, useEffect, useState } from 'react';
import useAuthState from '../store/Auth/useAuthState';
import { SERVER_URL } from '../App';
import { useDispatch } from 'react-redux';
import { actions as notificationActions } from '../store/Notification/notification';
import type { Notification } from '../store/Notification/notification';

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

type ChildProps = {
  children: React.ReactNode;
};

const SocketContextProvider = ({ children }: ChildProps) => {
  const authState = useAuthState();
  const dispatch = useDispatch();
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
        newSocket.emit('notification', (notifications: Notification[]) => {
          console.log(notifications);
          dispatch(notificationActions.setNotification(notifications));
        });
      });

      newSocket.on('disconnect', (reason: string) => {
        console.log('disconnected socket');

        if (reason === 'io server disconnect') {
          newSocket.connect();
        }
      });

      newSocket.on('updatedNotification', (notification: Notification) => {
        dispatch(notificationActions.appendNotification(notification));
      });

      setSocket(newSocket);
    }

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [socket, authState, dispatch]);

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
