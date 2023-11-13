import { useState } from 'react';

import styles from '../../styles/Friends.module.css';
import FriendList from './FriendList';
import FriendsSidebar from './FriendsSidebar';
import useModalState from '../../store/Modal/useModalState';
import AddFriendModal from '../Modal/AddFriendModal';
import FriendDetailModal from '../Modal/FriendDetailModal';
import FriendIconList from './FriendIconList';

type Friend = {
  id: string;
  image: string;
  status: 'offline' | 'online' | 'in-game';
  isBlocked: boolean;
};

const Friends = () => {
  const [selectedOption, setSelectedOption] = useState<string>('friends');

  const showFriendDetail = useModalState('showFriendDetail');

  const [activedFriend, setActivedFriend] = useState<Friend>({
    id: '',
    image: '',
    status: 'offline',
    isBlocked: false,
  });

  const showAddFriend = useModalState('showAddFriend');

  const changeOptionHandler = (option: string) => {
    setSelectedOption(option);
  };

  const activeFriendHandler = (friend: Friend) => {
    setActivedFriend({ ...friend });
  };

  return (
    <div className={styles.container}>
      <FriendsSidebar
        selectedOption={selectedOption}
        onChangeOption={changeOptionHandler}
      />
      <FriendList
        selectedOption={selectedOption}
        onActive={activeFriendHandler}
      />
      <FriendIconList />
      {showAddFriend && <AddFriendModal />}
      {showFriendDetail && (
        <FriendDetailModal friend={activedFriend as Friend} />
      )}
    </div>
  );
};
export default Friends;
