import { Message } from '.';
import AvatarImage from '../../UI/AvatarImage';
import styles from '../../styles/Chatting.module.css';
import SystemMessageItem from './SystemMessageItem';

type Props = Message & {
  image: string;
};

// until
const formatTimeToHHMM = (date: Date): string => {
  let hoursString = date.getHours().toString();
  let minutesString = date.getMinutes().toString();

  if (hoursString.length === 1) hoursString = hoursString + '0';
  if (minutesString.length === 1) minutesString = minutesString + '0';

  return `${hoursString}:${minutesString}`;
};

const ChattingMessageItem = ({ id, message, date, type, image }: Props) => {
  if (type === 'system') {
    return (
      <li className={styles['message-item']}>
        <SystemMessageItem message={`${id}${message}`} />
      </li>
    );
  }

  const isOther = id !== '이지수';

  return (
    <li className={styles['message-item']}>
      {isOther && (
        <div className={styles.sender}>
          <AvatarImage imageURI={image} radius="32px" />
          <span>{id}</span>
        </div>
      )}
      <div className={`${styles['message-box']} ${!isOther && styles.me}`}>
        <div className={styles.message}>{message}</div>
        <small className={styles['message-date']}>
          {formatTimeToHHMM(date)}
        </small>
      </div>
    </li>
  );
};
export default ChattingMessageItem;
