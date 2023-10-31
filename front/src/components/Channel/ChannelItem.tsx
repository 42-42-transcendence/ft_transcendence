import styles from '../../styles/Channel.module.css';
import lockIcon from '../../assets/lock-icon.svg';
import { Link } from 'react-router-dom';

type Props = {
  id: number;
  title: string;
  mode: 'public' | 'private' | 'direct';
  total?: number;
  password?: boolean;
};

const ChannelItem = ({ id, title, mode, total, password }: Props) => {
  return (
    <Link to={`/chatting/${id}`}>
      <li className={styles.item}>
        <div className={styles.title}>
          <div>{title}</div>
          {password && <img src={lockIcon} alt="lock icon" />}
        </div>
        <div>{mode !== 'direct' && total && `${total}/10`}</div>
      </li>
    </Link>
  );
};
export default ChannelItem;
