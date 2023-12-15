import { useCallback, useEffect, useState } from 'react';
import Chatting from '../components/Chatting';
import useRequest from '../http/useRequest';
import { useLocation, useParams } from 'react-router-dom';
import ChatPasswordModal from '../components/Modal/ChatPasswordModal';
import useOpenModal from '../store/Modal/useOpenModal';
import useModalState from '../store/Modal/useModalState';
import BackLink from '../UI/BackLink';
import useCloseModal from '../store/Modal/useCloseModal';
import { SERVER_URL } from '../App';
import loadingImage from '../assets/loading.gif';

type RequestPasswordRequired = {
  isPasswordRequired: boolean;
};

type RequestAuthenticated = {
  isAuthenticated: boolean;
};

const ChattingPage = () => {
  const location = useLocation();

  const params = useParams();
  const closeModalHandler = useCloseModal();

  const showChatPassword = useModalState('showChatPassword');
  const openModalHandler = useOpenModal('showChatPassword');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const { isLoading, error, request } = useRequest();

  const requestAuthenticated = useCallback(
    async (password: string = '', isRedirected: boolean = false) => {
      const ret = await request<RequestAuthenticated>(
        `${SERVER_URL}/api/channel/${params.channelID}/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: password,
            isRedirected: isRedirected,
          }),
        }
      );

      if (ret === null) return;
      setIsAuthenticated(ret.isAuthenticated);
      if (ret.isAuthenticated) {
        closeModalHandler();
      }
    },
    [params, request, closeModalHandler]
  );

  useEffect(() => {
    const protectedChattingPage = async () => {
      if (location.state?.redirect === true) {
        requestAuthenticated('', true);
        return;
      }
      const ret = await request<RequestPasswordRequired>(
        `${SERVER_URL}/api/channel/${params.channelID}/join`,
        {
          method: 'GET',
        }
      );

      if (ret === null) return;
      else if (ret.isPasswordRequired === false) {
        requestAuthenticated();
      } else {
        openModalHandler();
      }
    };

    protectedChattingPage();
  }, [request, openModalHandler, requestAuthenticated, params, location]);

  if (error) {
    return (
      <>
        <h1>접근할 수 없습니다.</h1>
        <p>{error}</p>
        <BackLink title="채널목록보기" redirect="/channels" />
      </>
    );
  } else if (showChatPassword)
    return (
      <ChatPasswordModal
        onPassowrdSubmit={requestAuthenticated}
        isLoading={isLoading}
      />
    );
  else if (isLoading)
    return (
      <div>
        <h1>..Check Access Authentication..</h1>
        <img src={loadingImage} alt="loading" />
      </div>
    );
  else if (isAuthenticated === true) return <Chatting />;
  else if (isAuthenticated === false) {
    return (
      <>
        <h1>해당 채팅방에 접근할 수 없습니다.</h1>
        <BackLink title="채널목록보기" redirect="/channels" />
      </>
    );
  }
  return <></>;
};

export default ChattingPage;
