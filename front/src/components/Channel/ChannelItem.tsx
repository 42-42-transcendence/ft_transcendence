import styles from '../../styles/Channel.module.css';
import lockIcon from '../../assets/lock-icon.svg';
import { Link } from 'react-router-dom';
import type { ChannelType } from '.';

const ChannelItem = ({
  channelID,
  title,
  type,
  total,
  password,
}: ChannelType) => {
  return (
    <Link to={`/chatting/${channelID}`} state={{ channelID, type }}>
      <li className={styles.item}>
        <div className={styles.title}>
          <div>{title}</div>
          {password && <img src={lockIcon} alt="lock icon" />}
        </div>
        <div>{type !== 'direct' && total && `${total}/10`}</div>
      </li>
    </Link>
  );
};
export default ChannelItem;