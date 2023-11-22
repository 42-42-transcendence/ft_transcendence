import { useState } from 'react';

import styles from '../../styles/Social.module.css';
import SocialList from './SocialList';
import SocialSidebar from './SocialSidebar';
import SocialIconList from './SocialIconList';
import AddFriendModal from '../Modal/AddFriendModal';
import useModalState from '../../store/Modal/useModalState';
import UserDetailModal from '../Modal/UserDetailModal';

export type Status = 'offline' | 'online' | 'in-game';
export type Relation = 'unknown' | 'friend' | 'block';
export type User = {
  id: string;
  image: string;
  status: Status;
  relation: Relation;
};

const Social = () => {
  const [selectedOption, setSelectedOption] = useState<string>('friends');

  const showUserDetail = useModalState('showUserDetail');
  const showAddFriend = useModalState('showAddFriend');

  const [activatedUserID, setActivatedUserID] = useState<string | null>(null);

  const changeOptionHandler = (option: string) => {
    setSelectedOption(option);
  };

  const setActivatedUserIDHandler = (userID: string) => {
    setActivatedUserID(userID);
  };

  return (
    <div className={styles.container}>
      <SocialSidebar
        selectedOption={selectedOption}
        onChangeOption={changeOptionHandler}
      />
      <SocialList
        selectedOption={selectedOption}
        onActive={setActivatedUserIDHandler}
      />
      <SocialIconList />
      {showAddFriend && <AddFriendModal />}
      {showUserDetail && (
        <UserDetailModal targetUserID={activatedUserID as string} />
      )}
    </div>
  );
};
export default Social;