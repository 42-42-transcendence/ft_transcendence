import styles from '../../styles/Chatting.module.css';
import ChattingMessageItem from './ChattingMessageItem';
import { useEffect, useRef } from 'react';
import type { ChatUser, Message } from '.';

type Props = {
  users: ChatUser[];
  messages: Message[];
};

const ChattingMessageList = ({ users, messages }: Props) => {
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, []);

  const messageItemList = messages.map((content) => {
    const sender = users.find((user) => user.id === content.id);

    return (
      <ChattingMessageItem
        key={content.key}
        id={content.id}
        message={content.message}
        date={content.date}
        image={
          sender
            ? sender.image
            : 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg'
        }
        type={content.type}
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
