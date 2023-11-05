import { useState } from 'react';

import styles from '../../styles/Friends.module.css';
import FriendList from './FriendList';
import FriendsSidebar from './FriendsSidebar';

const Friends = () => {
  const [selectedOption, setSelectedOption] = useState<string>('friends');

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
    </div>
  );
};
export default Friends;
