import {io, Socket} from 'socket.io-client';
import React, {createContext, useContext, useEffect, useState} from 'react';
import useAuthState from '../store/Auth/useAuthState';
import {SERVER_URL} from '../App';
import {useDispatch} from 'react-redux';
import type {Notification} from '../store/Notification/notification';
import {actions as notificationActions} from '../store/Notification/notification';
import {useNavigate} from 'react-router-dom';
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
        console.log('connected context');
        newSocket.emit('notification', (notifications: Notification[]) => {
          dispatch(notificationActions.setNotification(notifications));
        });
      });

      newSocket.on('disconnect', (reason: string) => {
        console.log('disconnected context');

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

      newSocket.on('startGame', (gameID: string, playerID: string[], mode: string) => {
        navigate(`/game/${gameID}`, { state: { mode, playerID } });
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
  return useContext(SocketContext);
};

export { SocketContextProvider, useSocket };