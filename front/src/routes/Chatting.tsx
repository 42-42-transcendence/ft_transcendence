import { useCallback, useEffect, useState } from 'react';
import Chatting from '../components/Chatting';
import useRequest from '../http/useRequest';
import { useParams } from 'react-router-dom';
import ChatPasswordModal from '../components/Modal/ChatPasswordModal';
import useOpenModal from '../store/Modal/useOpenModal';
import useModalState from '../store/Modal/useModalState';

type RequestPasswordRequired = {
  isPasswordRequired: boolean;
};

type RequestAuthenticated = {
  isAuthenticated: boolean;
};

const ChattingPage = () => {
  const params = useParams();

  const showChatPassword = useModalState('showChatPassword');
  const openModalHandler = useOpenModal('showChatPassword');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { isLoading, error, request } = useRequest();

  const requestAuthenticated = useCallback(
    async (password: string = '') => {
      const data = await request<RequestAuthenticated>(
        `http://localhost:3001/api/channel/${params.chatID}`,
        {
          method: 'POST',
          body: JSON.stringify({
            type: params.type,
            channelID: params.chatID,
            password,
          }),
        }
      );

      if (data?.isAuthenticated) {
        setIsAuthenticated(true);
      }
    },
    [params, request]
  );

  useEffect(() => {
    const protectedChattingPage = async () => {
      const data = await request<RequestPasswordRequired>(
        `http://localhost:3001/api/channel/${params.chatID}`,
        {
          method: 'GET',
        }
      );

      if (data?.isPasswordRequired) {
        openModalHandler();
      } else {
        requestAuthenticated();
      }
    };

    protectedChattingPage();
  }, [request, openModalHandler, requestAuthenticated, params]);

  let contents: React.ReactNode = '';
  if (error) contents = <h1>해당 채팅방에 접근할 수 없습니다.</h1>;
  else if (isLoading) contents = <h1>..Check Access Authentication..</h1>;
  else if (showChatPassword)
    contents = <ChatPasswordModal onPassowrdSubmit={requestAuthenticated} />;
  else if (isAuthenticated) contents = <Chatting />;

  return (
    <>
      <h1>Chatting Room Page</h1>
      {contents}
    </>
  );
};

export default ChattingPage;
