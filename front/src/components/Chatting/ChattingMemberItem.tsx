import UserItem from '../../UI/UserItem';
import styles from '../../styles/Chatting.module.css';
import useOpenModal from '../../store/Modal/useOpenModal';
import { ChatMember } from '.';

type Props = ChatMember & {
  onActive: (user: string) => void;
};

const ChattingMemberItem = ({ nickname, image, role, onActive }: Props) => {
  const openModalHandler = useOpenModal('showUserDetail');

  const activeHandler = () => {
    onActive(nickname);
    openModalHandler();
  };

  return (
    <li>
      <UserItem
        id={nickname}
        image={image}
        className={styles.member}
        clickHandler={activeHandler}
      >
        <div className={`${styles[role]}`}>
          {role !== 'guest' && role!.toLocaleUpperCase()}
        </div>
      </UserItem>
    </li>
  );
};
export default ChattingMemberItem;
