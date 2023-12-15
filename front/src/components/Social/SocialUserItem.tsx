import styles from '../../styles/Social.module.css';
import UserItem from '../../UI/UserItem';
import useOpenModal from '../../store/Modal/useOpenModal';
import { User } from '.';

type Props = User & {
  onActive: (userID: string) => void;
};

const SocialUserItem = ({ nickname, image, status, onActive }: Props) => {
  const openModalHandler = useOpenModal('showUserDetail');

  const activeHandler = () => {
    openModalHandler();
    onActive(nickname);
  };

  return (
    <li>
      <UserItem
        id={nickname}
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
