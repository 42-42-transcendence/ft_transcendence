import styles from '../../styles/Chatting.module.css';

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSocket } from '../../socket/SocketContext';

import ChattingMemberList from './ChattingMemberList';
import ChattingMessageList from './ChattingMessageList';
import ChattingForm from './ChattingForm';
import ChattingSettingList from './ChattingSettingList';
import useModalState from '../../store/Modal/useModalState';

import ConfirmModal from '../Modal/ConfirmModal';
import ChatMemberDetailModal from '../Modal/ChatMemberDetailModal';
import ChatInvitationModal from '../Modal/ChatInvitationModal';
import ChatRoomConfigModal from '../Modal/ChatRoomConfigModal';

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
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [activeMemeber, setActiveMember] = useState<Member | null>(null);

  const activeMemberHandler = (member: Member) => {
    setActiveMember({ ...member });
  };

  useEffect(() => {
    if (socket) {
      socket.emit('joinChannel', { channelID: params.channelID });

      socket.on('updatedMessage', () => {});

      socket.on('updatedMembers', () => {});
    }

    return () => {
      if (socket) {
        socket.emit('leaveChannel', { channelID: params.channelID });
        socket.off('updatedMessage');
        socket.off('updatedMembers');
      }
    };
  }, [socket, params]);

  const showChatRoomConfig = useModalState('showChatRoomConfig');
  const showChatInvitation = useModalState('showChatInvitation');
  const showChatMemberDetail = useModalState('showChatMemberDetail');
  const showConfirmModal = useModalState('showConfirmModal');

  return (
    <div className={styles.container}>
      <div className={styles.contents}>
        <ChattingMessageList members={members} messages={messages} />
        <ChattingForm />
      </div>
      <ChattingMemberList members={members} onActive={activeMemberHandler} />
      <ChattingSettingList />

      {showChatRoomConfig && <ChatRoomConfigModal />}
      {showChatInvitation && <ChatInvitationModal />}
      {showChatMemberDetail && (
        <ChatMemberDetailModal member={activeMemeber as Member} />
      )}
      {showConfirmModal && (
        <ConfirmModal
          title="채팅방 나가기"
          message="정말로 나가시겠습니까?"
          acceptHandler={() => {}}
        />
      )}
    </div>
  );
};
export default Chatting;
