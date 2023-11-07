import UserItem from '../../UI/UserItem';
import styles from '../../styles/Chatting.module.css';
import useOpenModal from '../Modal/useOpenModal';

type Member = {
  id: string;
  image: string;
  role: 'owner' | 'staff' | 'member';
  isMuted: boolean;
};
type Props = Member & {
  onActive: (member: Member) => void;
};

const ChattingMemberItem = ({ id, image, role, isMuted, onActive }: Props) => {
  const openModalHandler = useOpenModal('showChatMemberDetail');

  const activeHandler = () => {
    openModalHandler();
    onActive({ id, image, role, isMuted });
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
