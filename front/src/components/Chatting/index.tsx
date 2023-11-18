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
import ChatMemberDetailModal from '../Modal/ChatMemberDetailModal';
import ChatInvitationModal from '../Modal/ChatInvitationModal';
import ChatRoomConfigModal from '../Modal/ChatRoomConfigModal';
import MessageModal from '../Modal/MessageModal';
import useRequest from '../../http/useRequest';
import { SERVER_URL } from '../../App';

export type Member = {
  id: string;
  image: string;
  role: 'owner' | 'staff' | 'member';
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
  const openMessageModalHandler = useOpenModal('showMessageModal');
  const navigate = useNavigate();

  const [firedMessage, setFiredMessage] = useState<string>('');
  const [activeMemeber, setActiveMember] = useState<Member | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([
    {
      id: 'haha',
      image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
      role: 'owner',
      isMuted: false,
    },
  ]);

  const { request } = useRequest();

  const activeMemberHandler = (member: Member) => {
    setActiveMember({ ...member });
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
      socket.emit(
        'joinChannel',
        (channelInfo: { members: Member[]; messages: Message[] }) => {
          setMembers(channelInfo.members);
          setMessages(channelInfo.messages);
        }
      );

      socket.on('updatedMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('updatedMembers', (members: Member[]) => {
        setMembers(members);
      });

      socket.on('firedChannel', (message) => {
        setFiredMessage(message);
        openMessageModalHandler();
        // ok
      });
    }

    return () => {
      if (socket) {
        socket.emit('leaveChannel', { channelID: params.channelID as string });
        socket.off('updatedMessage');
        socket.off('updatedMembers');
      }
    };
  }, [socket, params, setMembers, openMessageModalHandler]);

  const showChatRoomConfig = useModalState('showChatRoomConfig');
  const showChatInvitation = useModalState('showChatInvitation');
  const showChatMemberDetail = useModalState('showChatMemberDetail');
  const showConfirmModal = useModalState('showConfirmModal');
  const showMessageModal = useModalState('showMessageModal');

  return (
    <>
      {/* <div className={styles['channel-title']}>{title}</div> */}
      <div className={styles.container}>
        <div className={styles.contents}>
          <ChattingMessageList members={members} messages={messages} />
          <ChattingForm socket={socket} />
        </div>
        <ChattingMemberList members={members} onActive={activeMemberHandler} />
        <ChattingSettingList />

        {/* modal */}
        {showChatRoomConfig && (
          <ChatRoomConfigModal channelID={params.channelID as string} />
        )}
        {showChatInvitation && (
          <ChatInvitationModal channelID={params.channelID as string} />
        )}
        {showChatMemberDetail && (
          <ChatMemberDetailModal member={activeMemeber as Member} />
        )}
        {showConfirmModal && (
          <ConfirmModal
            title="채팅방 나가기"
            message="정말로 나가시겠습니까?"
            acceptCallback={unsubscribeHandler}
          />
        )}
        {showMessageModal && (
          <MessageModal
            title="채팅방 알림"
            message={firedMessage}
            acceptCallback={() => {
              navigate('/channels');
            }}
          />
        )}
      </div>
    </>
  );
};
export default Chatting;
