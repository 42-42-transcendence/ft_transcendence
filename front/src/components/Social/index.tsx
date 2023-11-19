import { useState } from 'react';

import styles from '../../styles/Social.module.css';
import SocialList from './SocialList';
import SocialSidebar from './SocialSidebar';
import SocialIconList from './SocialIconList';
import AddFriendModal from '../Modal/AddFriendModal';
import useModalState from '../../store/Modal/useModalState';
import UserDetailModal from '../Modal/UserDetailModal';

export type User = {
  id: string;
  image: string;
  relation: 'normal' | 'friend' | 'block';
  status: 'offline' | 'online' | 'in-game';
};

const Social = () => {
  const [selectedOption, setSelectedOption] = useState<string>('friends');

  const showUserDetail = useModalState('showUserDetail');
  const showAddFriend = useModalState('showAddFriend');

  const [activeUser, setActiveUser] = useState<User | null>(null);

  const changeOptionHandler = (option: string) => {
    setSelectedOption(option);
  };

  const setActiveUserHandler = (user: User) => {
    setActiveUser({ ...user });
  };

  return (
    <div className={styles.container}>
      <SocialSidebar
        selectedOption={selectedOption}
        onChangeOption={changeOptionHandler}
      />
      <SocialList
        selectedOption={selectedOption}
        onActive={setActiveUserHandler}
      />
      <SocialIconList />
      {showAddFriend && <AddFriendModal />}
      {showUserDetail && <UserDetailModal user={activeUser as User} />}
    </div>
  );
};
export default Social;
