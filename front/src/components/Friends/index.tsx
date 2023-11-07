import { useState } from 'react';

import styles from '../../styles/Friends.module.css';
import FriendList from './FriendList';
import FriendsSidebar from './FriendsSidebar';
import useModalState from '../Modal/useModalState';
import FriendRequestModal from '../Modal/FriendRequestModal';

const Friends = () => {
  const [selectedOption, setSelectedOption] = useState<string>('friends');

  const showFriendRequest = useModalState('showFriendRequest');

  const changeOptionHandler = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className={styles.container}>
      <FriendsSidebar
        selectedOption={selectedOption}
        onChangeOption={changeOptionHandler}
      />
      <FriendList selectedOption={selectedOption} />
      {showFriendRequest && <FriendRequestModal />}
    </div>
  );
};
export default Friends;
