import UserItem from '../../UI/UserItem';
import styles from '../../styles/Chatting.module.css';

type Props = {
  id: string;
  image: string;
  role: 'owner' | 'staff' | 'member';
  isMuted: boolean;
};

const MemberItem = ({ id, image, role, isMuted }: Props) => {
  return (
    <li>
      <UserItem id={id} image={image} className={styles.item}>
        <div className={`${styles[role]}`}>
          {role !== 'member' && role.toLocaleUpperCase()}
        </div>
      </UserItem>
    </li>
  );
};
export default MemberItem;
