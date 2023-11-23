import type { User } from '.';
import styles from '../../styles/Social.module.css';
import SocialUserItem from './SocialUserItem';

const sortByStatus = (a: User, b: User): number => {
  const aPriority = a.status === 'offline' ? 1 : 0;
  const bPriority = b.status === 'offline' ? 1 : 0;
  return aPriority - bPriority;
};

type Props = {
  filteredUsers: User[];
  onActive: (userID: string) => void;
};

const SocialUserList = ({ filteredUsers, onActive }: Props) => {
  filteredUsers.sort(sortByStatus);

  const userItemList = filteredUsers.map((user) => (
    <SocialUserItem
      key={user.nickname}
      nickname={user.nickname}
      image={user.image}
      status={user.status}
      relation={user.relation}
      onActive={onActive}
    />
  ));

  return (
    <ul className={styles.items}>
      {userItemList.length === 0 ? (
        <h1 className={styles['no-content']}>No Users</h1>
      ) : (
        userItemList
      )}
    </ul>
  );
};

export default SocialUserList;
