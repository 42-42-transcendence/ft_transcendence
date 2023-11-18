import styles from '../../styles/Chatting.module.css';
import ChattingMessageItem from './ChattingMessageItem';
import { useEffect, useRef } from 'react';
import type { Member, Message } from '.';

type Props = {
  members: Member[];
  messages: Message[];
};

const ChattingMessageList = ({ members, messages }: Props) => {
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, []);

  const messageItemList = messages.map((content) => {
    const senderInMembers = members.find((member) => member.id === content.id);

    return (
      <ChattingMessageItem
        key={content.key}
        id={content.id}
        message={content.message}
        date={content.date}
        image={
          senderInMembers
            ? senderInMembers.image
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
