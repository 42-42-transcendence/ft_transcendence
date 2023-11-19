import UserItem from '../../UI/UserItem';
import styles from '../../styles/Chatting.module.css';
import useOpenModal from '../../store/Modal/useOpenModal';
import { ChatUser } from '.';

type Props = ChatUser & {
  onActive: (user: ChatUser) => void;
};

const ChattingUserItem = ({
  id,
  image,
  relation,
  status,
  role,
  isMuted,
  onActive,
}: Props) => {
  const openModalHandler = useOpenModal('showUserDetail');

  const activeHandler = () => {
    onActive({ id, image, relation, status, role, isMuted });
    openModalHandler();
  };

  return (
    <li>
      <UserItem
        id={id}
        image={image}
        className={styles.user}
        clickHandler={activeHandler}
      >
        <div className={`${styles[role]}`}>
          {role !== 'member' && role!.toLocaleUpperCase()}
        </div>
      </UserItem>
    </li>
  );
};
export default ChattingUserItem;
