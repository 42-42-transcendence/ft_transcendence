import styles from '../../styles/Chatting.module.css';
import ChattingMessageItem from './ChattingMessageItem';
import { useEffect, useRef } from 'react';
import type { ChatMember, Message } from '.';

type Props = {
  members: ChatMember[];
  messages: Message[];
};

const ChattingMessageList = ({ members, messages }: Props) => {
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const messageItemList = messages.map((message) => {
    const sender = members.find(
      (member) => member.nickname === message.userNickname
    );

    return (
      <ChattingMessageItem
        key={message.chatID}
        message={message}
        image={
          sender
            ? sender.image
            : 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg'
        }
      />
    );
  });

  return (
    <ul ref={listRef} className={styles['message-list']}>
      {messageItemList}
    </ul>
  );
};
export default ChattingMessageList;
