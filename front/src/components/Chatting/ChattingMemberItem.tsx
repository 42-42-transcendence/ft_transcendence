import UserItem from '../../UI/UserItem';
import styles from '../../styles/Chatting.module.css';
import useOpenModal from '../../store/Modal/useOpenModal';
import { Member } from '.';

type Props = Member & {
  onActive: (member: Member) => void;
};

const ChattingMemberItem = ({ id, image, role, isMuted, onActive }: Props) => {
  const openModalHandler = useOpenModal('showChatMemberDetail');

  const activeHandler = () => {
    onActive({ id, image, role, isMuted });
    openModalHandler();
  };

  return (
    <li>
      <UserItem
        id={id}
        image={image}
        className={styles.member}
        clickHandler={activeHandler}
      >
        <div className={`${styles[role]}`}>
          {role !== 'member' && role.toLocaleUpperCase()}
        </div>
      </UserItem>
    </li>
  );
};
export default ChattingMemberItem;
