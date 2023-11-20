import styles from '../../styles/Chatting.module.css';

import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import { useSocket } from '../../socket/SocketContext';
import { SERVER_URL } from '../../App';
import type { Relation } from '../Social';
import ChattingMemberList from './ChattingMemberList';
import ChattingMessageList from './ChattingMessageList';
import ChattingForm from './ChattingForm';
import ChattingSettingList from './ChattingSettingList';
import useModalState from '../../store/Modal/useModalState';
import useOpenModal from '../../store/Modal/useOpenModal';
import useRequest from '../../http/useRequest';
import ConfirmModal from '../Modal/ConfirmModal';
import ChatInvitationModal from '../Modal/ChatInvitationModal';
import ChatRoomConfigModal from '../Modal/ChatRoomConfigModal';
import MessageModal from '../Modal/MessageModal';
import UserDetailModal from '../Modal/UserDetailModal';
import useAuthState from '../../store/Auth/useAuthState';

export type Role = 'owner' | 'staff' | 'guest';
export type ChatMember = {
  id: string;
  image: string;
  relation: Relation;
  role: Role;
  isMuted: boolean;
};
export type Message = {
  chatID: number;
  nickname: string;
  type: 'normal' | 'system';
  date: Date;
  content: string;
};
type ChannelAllInfo = {
  title: string;
  messages: Message[];
  members: ChatMember[];
};

const Chatting = () => {
  const { request } = useRequest();
  const { myID } = useAuthState();
  const { socket } = useSocket();
  const params = useParams();
  const navigate = useNavigate();
  const openMessageModalHandler = useOpenModal('showMessage');

  const [channelTitle, setChannelTitle] = useState<string>('Chatting Room');
  const [firedMessage, setFiredMessage] = useState<string>('');
  const [activatedUserID, setActivatedUserID] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<ChatMember[]>([
    {
      id: 'heryu',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'owner',
      isMuted: false,
      relation: 'unknown',
    },
    {
      id: 'a',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'staff',
      isMuted: false,
      relation: 'unknown',
    },
    {
      id: 'b',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'staff',
      isMuted: true,
      relation: 'unknown',
    },
    {
      id: 'c',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'guest',
      isMuted: false,
      relation: 'block',
    },
    {
      id: 'd',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'guest',
      isMuted: false,
      relation: 'block',
    },
    {
      id: 'e',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'guest',
      isMuted: false,
      relation: 'unknown',
    },
    {
      id: 'f',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'guest',
      isMuted: false,
      relation: 'unknown',
    },
  ]);

  const myMember = members.find((member) => member.id === myID);
  const targetMember = members.find((member) => member.id === activatedUserID);

  const myRole = myMember?.role ?? null;
  const targetRole = targetMember?.role ?? null;
  const targetIsMuted = targetMember?.isMuted ?? null;

  const setActivatedUserIDHandler = (userID: string) => {
    setActivatedUserID(userID);
  };

  const unsubscribeHandler = async () => {
    await request<{ message: string }>(
      `${SERVER_URL}/api/channel/${params.channelID}`,
      { method: 'GET' }
    );

    navigate('/channels');
  };

  const isBlockedMember = useCallback(
    (targetID: string) => {
      const flag = members.find(
        (member) => member.id === targetID && member.relation === 'block'
      );
      if (!flag) return false;
      else return true;
    },
    [members]
  );

  const cleanupSocketEvent = useCallback(() => {
    if (socket?.connected) {
      socket.emit('leaveChannel', params.channelID);
      socket.off('updatedMessage');
      socket.off('updatedMember');
      socket.off('updatedChannelTitle');
      socket.off('firedChannel');
    }
  }, [socket, params.channelID]);

  const joinChannelAckHandler = useCallback(
    ({ title, messages, members }: ChannelAllInfo) => {
      setChannelTitle(title);
      setMembers(members);
      setMessages(
        messages.filter((message) => !isBlockedMember(message.nickname))
      );
    },
    [isBlockedMember]
  );

  const updatedMessageHandler = useCallback(
    (message: Message) => {
      if (isBlockedMember(message.nickname)) return;

      setMessages((prevMessages) => [...prevMessages, message]);
    },
    [isBlockedMember]
  );

  const updatedMemberHandler = useCallback((members: ChatMember[]) => {
    setMembers(members);
  }, []);

  const updatedChannelTitleHandler = useCallback((title: string) => {
    setChannelTitle(title);
  }, []);

  const firedChannelHandler = useCallback(
    (message: string) => {
      cleanupSocketEvent();
      setFiredMessage(message);
      openMessageModalHandler();
    },
    [cleanupSocketEvent, openMessageModalHandler]
  );

  useEffect(() => {
    if (socket?.connected) {
      socket.emit('joinChannel', params.channelID); //, joinChannelAckHandler);
      socket.on('updatedMessage', updatedMessageHandler);
      socket.on('updatedMember', updatedMemberHandler);
      socket.on('updatedChannelTitle', updatedChannelTitleHandler);
      socket.on('firedChannel', firedChannelHandler);
    }

    return () => {
      cleanupSocketEvent();
    };
  }, [
    socket,
    params.channelID,
    joinChannelAckHandler,
    updatedMessageHandler,
    updatedMemberHandler,
    updatedChannelTitleHandler,
    firedChannelHandler,
    cleanupSocketEvent,
  ]);

  const showChatRoomConfig = useModalState('showChatRoomConfig');
  const showChatInvitation = useModalState('showChatInvitation');
  const showUserDetail = useModalState('showUserDetail');
  const showConfirm = useModalState('showConfirm');
  const showMessage = useModalState('showMessage');

  const renderChatRoomConfig = showChatRoomConfig && (
    <ChatRoomConfigModal channelID={params.channelID as string} />
  );

  const renderChatInvitation = showChatInvitation && (
    <ChatInvitationModal channelID={params.channelID as string} />
  );

  const renderUserDetail = showUserDetail && (
    <UserDetailModal
      targetUserID={activatedUserID as string}
      channelState={{ myRole, targetRole, targetIsMuted }}
    />
  );

  const renderConfirm = showConfirm && (
    <ConfirmModal
      title="채팅방 나가기"
      message="정말로 나가시겠습니까?"
      acceptCallback={unsubscribeHandler}
    />
  );

  const renderMessage = showMessage && (
    <MessageModal
      title="채팅방 알림"
      message={firedMessage}
      acceptCallback={() => {
        navigate('/channels');
      }}
    />
  );

  return (
    <>
      <h1 className={styles['channel-title']}>{channelTitle}</h1>
      <div className={styles.container}>
        {myRole && (
          <>
            <div className={styles.contents}>
              <ChattingMessageList members={members} messages={messages} />
              <ChattingForm
                socket={socket}
                channelID={params.channelID as string}
              />
            </div>
            <ChattingMemberList
              members={members}
              onActive={setActivatedUserIDHandler}
            />
            <ChattingSettingList myRole={myRole} />
            {renderChatRoomConfig}
            {renderChatInvitation}
            {renderUserDetail}
            {renderConfirm}
          </>
        )}
        {renderMessage}
      </div>
    </>
  );
};
export default Chatting;
