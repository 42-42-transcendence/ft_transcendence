import ChattingMessageItem from './ChattingMessageItem';

import styles from '../../styles/Chatting.module.css';
import { useEffect, useRef } from 'react';

type Content = {
  key: number;
  id: string;
  message: string;
  date: Date;
  type: 'normal' | 'system';
};

type Member = {
  id: string;
  image: string;
  role: 'owner' | 'staff' | 'member';
  isMuted: boolean;
};

type Props = {
  members: Member[];
  contents: Content[];
};

const ChattingMessageList = ({ members, contents }: Props) => {
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, []);

  const messageItemList = contents.map((content) => {
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
