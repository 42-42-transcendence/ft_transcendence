import styles from '../../styles/Social.module.css';
import UserItem from '../../UI/UserItem';
import useOpenModal from '../../store/Modal/useOpenModal';
import { User } from '.';

type Props = User & {
  onActive: (user: User) => void;
};

const SocialUserItem = ({ id, image, status, relation, onActive }: Props) => {
  const openModalHandler = useOpenModal('showUserDetail');

  const activeHandler = () => {
    openModalHandler();
    onActive({ id, image, status, relation });
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
export default SocialUserItem;
