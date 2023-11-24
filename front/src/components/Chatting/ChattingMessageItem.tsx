import { Message } from '.';
import AvatarImage from '../../UI/AvatarImage';
import useAuthState from '../../store/Auth/useAuthState';
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

  if (hoursString.length === 1) hoursString = hoursString + '0';
  if (minutesString.length === 1) minutesString = minutesString + '0';

  return `${hoursString}:${minutesString}`;
};

const ChattingMessageItem = ({ message, image }: Props) => {
  const authState = useAuthState();
  if (message.chatType === 'system') {
    return (
      <li className={styles['message-item']}>
        <SystemMessageItem message={`${message.content}`} />
      </li>
    );
  }

  const isOther = message.userNickname !== authState.myID;

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
