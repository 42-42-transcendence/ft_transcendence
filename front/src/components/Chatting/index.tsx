import styles from '../../styles/Chatting.module.css';

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSocket } from '../../socket/SocketContext';

import ChattingMemberList from './ChattingMemberList';
import ChattingMessageList from './ChattingMessageList';
import ChattingForm from './ChattingForm';
import ChattingSettingList from './ChattingSettingList';
import useModalState from '../../store/Modal/useModalState';
import useOpenModal from '../../store/Modal/useOpenModal';

import ConfirmModal from '../Modal/ConfirmModal';
import ChatInvitationModal from '../Modal/ChatInvitationModal';
import ChatRoomConfigModal from '../Modal/ChatRoomConfigModal';
import MessageModal from '../Modal/MessageModal';
import useRequest from '../../http/useRequest';
import { SERVER_URL } from '../../App';
import UserDetailModal from '../Modal/UserDetailModal';
import { User } from '../Social';

export type Role = 'owner' | 'staff' | 'guest';

export type ChatMember = User & {
  role: Role;
  isMuted: boolean;
};

export type Message = {
  key: number;
  id: string;
  message: string;
  date: Date;
  type: 'normal' | 'system';
};

const Chatting = () => {
  const params = useParams();
  const { socket } = useSocket();
  const openMessageModalHandler = useOpenModal('showMessage');
  const navigate = useNavigate();

  const [firedMessage, setFiredMessage] = useState<string>('');
  const [activatedUser, setActivatedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<ChatMember[]>([
    {
      id: 'heryu',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'owner',
      isMuted: false,
      status: 'online',
      relation: 'unknown',
    },
    {
      id: 'a',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'staff',
      isMuted: false,
      status: 'offline',
      relation: 'friend',
    },
    {
      id: 'b',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'staff',
      isMuted: true,
      status: 'online',
      relation: 'unknown',
    },
    {
      id: 'c',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'guest',
      isMuted: false,
      status: 'online',
      relation: 'block',
    },
    {
      id: 'd',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'guest',
      isMuted: false,
      status: 'offline',
      relation: 'block',
    },
    {
      id: 'e',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'guest',
      isMuted: false,
      status: 'online',
      relation: 'unknown',
    },
    {
      id: 'f',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'guest',
      isMuted: false,
      status: 'offline',
      relation: 'friend',
    },
  ]);

  const { request } = useRequest();

  const setActivatedUserHandler = (userID: string) => {
    setActivatedUser(userID);
  };

  const unsubscribeHandler = async () => {
    await request<{ message: string }>(
      `${SERVER_URL}/api/channel/${params.channelID}`,
      { method: 'DELETE' }
    );

    navigate('/channels');
  };

  useEffect(() => {
    if (socket) {
      socket.emit('joinChannel', params.channelID, (any: any) => {
        console.log(any);
      });

      socket.on('updatedMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('updatedMember', (members: ChatMember[]) => {
        setMembers(members);
      });

      socket.on('firedChannel', (message) => {
        socket.emit('leaveChannel', { channelID: params.channelID as string });
        socket.off('updatedMessage');
        socket.off('updatedMember');
        socket.off('firedChannel');

        setFiredMessage(message);
        openMessageModalHandler();
      });
    }

    return () => {
      if (socket) {
        socket.emit('leaveChannel', { channelID: params.channelID as string });
        socket.off('updatedMessage');
        socket.off('updatedMember');
        socket.off('firedChannel');
      }
    };
  }, [socket, params, setMembers, openMessageModalHandler]);

  const showChatRoomConfig = useModalState('showChatRoomConfig');
  const showChatInvitation = useModalState('showChatInvitation');
  const showUserDetail = useModalState('showUserDetail');
  const showConfirm = useModalState('showConfirm');
  const showMessage = useModalState('showMessage');

  return (
    <div className={styles.container}>
      <div className={styles.contents}>
        <ChattingMessageList members={members} messages={messages} />
        <ChattingForm socket={socket} />
      </div>
      <ChattingMemberList
        members={members}
        onActive={setActivatedUserHandler}
      />
      <ChattingSettingList />

      {/* modal */}
      {showChatRoomConfig && (
        <ChatRoomConfigModal channelID={params.channelID as string} />
      )}
      {showChatInvitation && (
        <ChatInvitationModal channelID={params.channelID as string} />
      )}
      {showUserDetail && (
        <UserDetailModal
          targetUserID={activatedUser as string}
          channelState={{
            myRole: 'owner',
            targetRole: 'staff',
            isMutedTarget: false,
          }}
        />
      )}
      {showConfirm && (
        <ConfirmModal
          title="채팅방 나가기"
          message="정말로 나가시겠습니까?"
          acceptCallback={unsubscribeHandler}
        />
      )}
      {showMessage && (
        <MessageModal
          title="채팅방 알림"
          message={firedMessage}
          acceptCallback={() => {
            navigate('/channels');
          }}
        />
      )}
    </div>
  );
};
export default Chatting;
