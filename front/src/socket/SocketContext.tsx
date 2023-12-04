import { Socket, io } from 'socket.io-client';
import { createContext, useContext, useEffect, useState } from 'react';
import useAuthState from '../store/Auth/useAuthState';
import { SERVER_URL } from '../App';
import { useDispatch } from 'react-redux';
import { actions as notificationActions } from '../store/Notification/notification';
import type { Notification } from '../store/Notification/notification';
import { useNavigate } from 'react-router-dom';
import useUserState from '../store/User/useUserState';

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

type ChildProps = {
  children: React.ReactNode;
};

const SocketContextProvider = ({ children }: ChildProps) => {
  const authState = useAuthState();
  const userState = useUserState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socket) {
      const newSocket = io(SERVER_URL, {
        auth: {
          token: authState.token,
        },
        query: {
          userID: userState.id,
        },
      });

      // 확인차 출력
      newSocket.on('connect', () => {
        console.log('connected socket');
        newSocket.emit('notification', (notifications: Notification[]) => {
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

      newSocket.on('sessionExpired', (message) => {
        navigate('/login', { state: { message: message } });
      });

      /** sangmiha
       * 여기서 필요한 데이터 서버에서 받아서 사용하시면 될 겁니다.
       */
      newSocket.on('startGame', (gameID: string) => {
        navigate(`/game/${gameID}`);
      });

      setSocket(newSocket);
    }

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [socket, authState, userState, dispatch, navigate]);

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
