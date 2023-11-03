import AvatarImage from '../../UI/AvatarImage';
import CardButton from '../../UI/CardButton';

import styles from '../../styles/Friends.module.css';

type Props = {
  id: string;
  image: string;
  status: 'offline' | 'online' | 'in-game';
  isBlocked: boolean;
};

const FriendItem = ({ id, image, status, isBlocked }: Props) => {
  return (
    <li>
      <CardButton className={`${styles.item} ${styles[status]}`}>
        <AvatarImage imageURI={image} radius="30%" />
        <div className={styles.info}>
          <div className={styles.name}>{id}</div>
          <div className={`${styles.status} ${styles[status]}`}>{status}</div>
        </div>
      </CardButton>
    </li>
  );
};
export default FriendItem;
