import { Message } from '.';
import AvatarImage from '../../UI/AvatarImage';
import styles from '../../styles/Chatting.module.css';
import SystemMessageItem from './SystemMessageItem';

type Props = {
  message: Message;
  image: string;
};

const formatTimeToHHMM = (date: Date): string => {
  let hoursString = date.getHours().toString();
  let minutesString = date.getMinutes().toString();

  if (hoursString.length === 1) hoursString = hoursString + '0';
  if (minutesString.length === 1) minutesString = minutesString + '0';

  return `${hoursString}:${minutesString}`;
};

const ChattingMessageItem = ({ message, image }: Props) => {
  if (message.type === 'system') {
    return (
      <li className={styles['message-item']}>
        <SystemMessageItem message={`${message.nickname}${message.content}`} />
      </li>
    );
  }
  // check me
  const isOther = message.nickname !== '이지수';

  return (
    <li className={styles['message-item']}>
      {isOther && (
        <div className={styles.sender}>
          <AvatarImage imageURI={image} radius="32px" />
          <span>{message.nickname}</span>
        </div>
      )}
      <div className={`${styles['message-box']} ${!isOther && styles.me}`}>
        <div className={styles.message}>{message.content}</div>
        <small className={styles['message-date']}>
          {formatTimeToHHMM(message.date)}
        </small>
      </div>
    </li>
  );
};
export default ChattingMessageItem;
