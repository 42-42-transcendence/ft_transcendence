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
import useUserState from '../../store/User/useUserState';

export type Role = 'owner' | 'staff' | 'guest';
export type ChatMember = {
  nickname: string;
  image: string;
  relation: Relation;
  role: Role;
  isMuted: boolean;
};
export type Message = {
  chatID: number;
  userNickname: string;
  chatType: 'normal' | 'system';
  createdAt: string;
  content: string;
};
type ChannelAllInfo = {
  title: string;
  messages: Message[];
  members: ChatMember[];
};

const isBlockedMember = (targetID: string, members: ChatMember[]) => {
  const flag = members.find(
    (member) => member.nickname === targetID && member.relation === 'block'
  );
  if (!flag) return false;
  else return true;
};

const Chatting = () => {
  const { request } = useRequest();
  const { socket } = useSocket();
  const params = useParams();
  const navigate = useNavigate();
  const openMessageModalHandler = useOpenModal('showMessage');
  const userState = useUserState();

  const [channelTitle, setChannelTitle] = useState<string>('Chatting Room');
  const [firedMessage, setFiredMessage] = useState<string>('');
  const [activatedUserID, setActivatedUserID] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<ChatMember[]>([]);

  const chatMember = members.find((member) => member.nickname === userState.id);
  const targetMember = members.find(
    (member) => member.nickname === activatedUserID
  );

  const myRole = chatMember?.role ?? null;
  const targetRole = targetMember?.role ?? null;
  const targetIsMuted = targetMember?.isMuted ?? null;

  const setActivatedUserIDHandler = (userID: string) => {
    setActivatedUserID(userID);
  };

  const unsubscribeHandler = async () => {
    await request<{ message: string }>(
      `${SERVER_URL}/api/channel/${params.channelID}/leave`,
      { method: 'GET' }
    );

    navigate('/channels');
  };

  const joinChannelAckHandler = useCallback(
    ({ title, messages, members }: ChannelAllInfo) => {
      setChannelTitle(title);
      setMembers(members);
      setMessages(
        messages
          .filter((message) => !isBlockedMember(message.userNickname, members))
          .slice(-100)
      );
    },
    []
  );

  const cleanupSocketEvent = useCallback(() => {
    if (socket) {
      socket.off('updatedMessage');
      socket.off('updatedMembers');
      socket.off('updatedChannelTitle');
      socket.off('firedChannel');
    }
  }, [socket]);

  const updatedMessageHandler = useCallback(
    (message: Message) => {
      if (isBlockedMember(message.userNickname, members)) return;

      setMessages((prevMessages) => [...prevMessages, message].slice(-100));
    },
    [members]
  );

  const updatedMembesrHandler = useCallback((members: ChatMember[]) => {
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

  const unloadHandler = useCallback(() => {
    if (socket) {
      socket.emit('leaveChannel', { channelID: params.channelID });
    }
    cleanupSocketEvent();
  }, [socket, params.channelID, cleanupSocketEvent]);

  useEffect(() => {
    if (socket) {
      socket.emit(
        'joinChannel',
        { channelID: params.channelID },
        joinChannelAckHandler
      );
      window.addEventListener('beforeunload', unloadHandler);
    }

    return () => {
      if (socket) {
        socket.emit('leaveChannel', { channelID: params.channelID });
        window.removeEventListener('beforeunload', unloadHandler);
      }
    };
  }, [socket, params.channelID, joinChannelAckHandler, unloadHandler]);

  useEffect(() => {
    if (socket) {
      socket.on('updatedMessage', updatedMessageHandler);
      socket.on('updatedMembers', updatedMembesrHandler);
      socket.on('updatedChannelTitle', updatedChannelTitleHandler);
      socket.on('firedChannel', firedChannelHandler);
    }
    return cleanupSocketEvent;
  }, [
    socket,
    updatedMessageHandler,
    updatedMembesrHandler,
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
