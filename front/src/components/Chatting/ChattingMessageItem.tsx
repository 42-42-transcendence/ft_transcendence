import { Message } from '.';
import AvatarImage from '../../UI/AvatarImage';
import useUserState from '../../store/User/useUserState';
import styles from '../../styles/Chatting.module.css';
import SystemMessageItem from './SystemMessageItem';

type Props = {
  message: Message;
  image: string;
};

const formatTimeToHHMM = (dateStr: string): string => {
  const date = new Date(dateStr);

  let hoursString = date.getHours().toString();
  let minutesString = date.getMinutes().toString();

  if (hoursString.length === 1) hoursString = '0' + hoursString;
  if (minutesString.length === 1) minutesString = '0' + minutesString;

  return `${hoursString}:${minutesString}`;
};

const ChattingMessageItem = ({ message, image }: Props) => {
  const userState = useUserState();

  if (message.chatType === 'system') {
    return (
      <li className={styles['message-item']}>
        <SystemMessageItem message={`${message.content}`} />
      </li>
    );
  }

  const isOther = message.userNickname !== userState.id;

  return (
    <li className={styles['message-item']}>
      {isOther && (
        <div className={styles.sender}>
          <AvatarImage imageURI={image} radius="32px" />
          <span>{message.userNickname}</span>
        </div>
      )}
      <div className={`${styles['message-box']} ${!isOther && styles.me}`}>
        <div className={styles.message}>{message.content}</div>
        <small className={styles['message-date']}>
          {formatTimeToHHMM(message.createdAt)}
        </small>
      </div>
    </li>
  );
};
export default ChattingMessageItem;
