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
    async (password: string = '') => {
      const ret = await request<RequestAuthenticated>(
        `${SERVER_URL}/api/channel/${params.channelID}/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channelID: params.channelID,
            password: password,
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
      const ret = await request<RequestPasswordRequired>(
        `${SERVER_URL}/api/channel/${params.channelID}/join`,
        {
          method: 'GET',
        }
      );

      if (ret === null) return;
      else if (
        ret.isPasswordRequired === false ||
        location.state.initialRedirect === true
      ) {
        requestAuthenticated();
      } else {
        openModalHandler();
      }
    };

    protectedChattingPage();
  }, [request, openModalHandler, requestAuthenticated, params, location]);

  let contents: React.ReactNode = 'Wait For..';
  if (error) {
    contents = (
      <>
        <h1>!!!ERROR!!!</h1>
        <p>{error}</p>
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
