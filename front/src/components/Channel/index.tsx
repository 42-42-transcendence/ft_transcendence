import { useState } from 'react';
import ChannelSidebar from './ChannelSidebar';
import ChannelList from './ChannelList';

import styles from '../../styles/Channel.module.css';
import useModalState from '../Modal/useModalState';
import CreatingChatRoomModal from '../Modal/CreatingChatRoomModal';
import ChannelIconList from './ChannelIconList';

const Channel = () => {
  const [selectedOption, setSelectedOption] = useState<string>('public');
  const showCreatingChatRoom = useModalState('showCreatingChatRoom');

  const changeOptionHandler = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <>
      <div className={styles.container}>
        <ChannelSidebar
          selectedOption={selectedOption}
          onChangeOption={changeOptionHandler}
        />
        <ChannelList selectedOption={selectedOption} />
        <ChannelIconList />
      </div>
      {showCreatingChatRoom && <CreatingChatRoomModal />}
    </>
  );
};
export default Channel;
