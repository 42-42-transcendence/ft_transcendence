import { useCallback, useEffect, useState } from 'react';
import Chatting from '../components/Chatting';
import useRequest from '../http/useRequest';
import { useParams } from 'react-router-dom';
import ChatPasswordModal from '../components/Modal/ChatPasswordModal';
import useOpenModal from '../store/Modal/useOpenModal';
import useModalState from '../store/Modal/useModalState';
import BackLink from '../UI/BackLink';
import useCloseModal from '../store/Modal/useCloseModal';

type RequestPasswordRequired = {
  isPasswordRequired: boolean;
};

type RequestAuthenticated = {
  isAuthenticated: boolean;
};

const ChattingPage = () => {
  const params = useParams();
  const closeModalHandler = useCloseModal();

  const showChatPassword = useModalState('showChatPassword');
  const openModalHandler = useOpenModal('showChatPassword');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const { isLoading, error, request } = useRequest();

  const requestAuthenticated = useCallback(
    async (password: string = '') => {
      const data = await request<RequestAuthenticated>(
        `http://localhost:3001/api/channel/${params.chatID}/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channelID: params.chatID,
            password: password,
          }),
        }
      );
      if (data === null) return;

      setIsAuthenticated(data.isAuthenticated);
      if (data.isAuthenticated) {
        closeModalHandler();
      }
    },
    [params, request, closeModalHandler]
  );

  useEffect(() => {
    const protectedChattingPage = async () => {
      const data = await request<RequestPasswordRequired>(
        `http://localhost:3001/api/channel/${params.chatID}/join`,
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

  let contents: React.ReactNode = 'Wait For..';
  if (error) {
    contents = (
      <>
        <h1>{error}</h1>
        <BackLink title="채널목록보기" redirect="/channels" />
      </>
    );
  } else if (showChatPassword)
    contents = <ChatPasswordModal onPassowrdSubmit={requestAuthenticated} />;
  else if (isLoading) contents = <h1>..Check Access Authentication..</h1>;
  else if (isAuthenticated === true) contents = <Chatting />;
  else if (isAuthenticated === false) {
    contents = (
      <>
        <h1>해당 채팅방에 접근할 수 없습니다.</h1>
        <BackLink title="채널목록보기" redirect="/channels" />
      </>
    );
  }

  return (
    <>
      <h1>Chatting Room Page</h1>
      {contents}
    </>
  );
};

export default ChattingPage;
