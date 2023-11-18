import UserItem from '../../UI/UserItem';

import styles from '../../styles/Friends.module.css';
import useOpenModal from '../../store/Modal/useOpenModal';

type Friend = {
  id: string;
  image: string;
  status: 'offline' | 'online' | 'in-game';
  isBlocked: boolean;
};

type Props = Friend & {
  onActive: (friend: Friend) => void;
};

const FriendItem = ({ id, image, status, isBlocked, onActive }: Props) => {
  const openModalHandler = useOpenModal('showFriendDetail');

  const activeHandler = () => {
    openModalHandler();
    onActive({ id, image, status, isBlocked });
  };

  return (
    <li>
      <UserItem
        id={id}
        image={image}
        className={`${styles.item} ${styles[status]}`}
        clickHandler={activeHandler}
      >
        <div className={`${styles.status} ${styles[status]}`}>{status}</div>
      </UserItem>
    </li>
  );
};
export default FriendItem;
