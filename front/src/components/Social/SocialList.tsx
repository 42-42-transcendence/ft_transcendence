import type { User } from '.';
import styles from '../../styles/Social.module.css';
import SocialUserItem from './SocialUserItem';
import loadingImage from '../../assets/loading.gif';

const sortByStatus = (a: User, b: User): number => {
  const aPriority = a.status === 'offline' ? 1 : 0;
  const bPriority = b.status === 'offline' ? 1 : 0;
  return aPriority - bPriority;
};

type Props = {
  filteredUsers: User[];
  onActive: (userID: string) => void;
  isLoading: boolean;
  error: string;
};

const SocialUserList = ({
  filteredUsers,
  onActive,
  isLoading,
  error,
}: Props) => {
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

  let contents: React.ReactNode = userItemList;
  if (error) contents = <h1 className={styles['full-width']}>{error}</h1>;
  else if (isLoading)
    contents = (
      <div className={styles['full-width']}>
        <img src={loadingImage} alt="loading" />
      </div>
    );
  else if (userItemList.length === 0)
    contents = <h1 className={styles['full-width']}>No Users.</h1>;

  return <ul className={styles.items}>{contents}</ul>;
};

export default SocialUserList;
