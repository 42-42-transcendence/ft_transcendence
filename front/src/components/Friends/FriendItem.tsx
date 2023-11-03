import UserItem from '../../UI/UserItem';

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
      <UserItem
        id={id}
        image={image}
        className={`${styles.item} ${styles[status]}`}
      >
        <div className={`${styles.status} ${styles[status]}`}>{status}</div>
      </UserItem>
    </li>
  );
};
export default FriendItem;
