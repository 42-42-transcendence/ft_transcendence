import { useState } from 'react';

import styles from '../../styles/Channel.module.css';
import ChannelSidebar from './ChannelSidebar';
import ChannelList from './ChannelList';

const Channel = () => {
  const [selectedOption, setSelectedOption] = useState<string>('public');

  const changeOptionHandler = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className={styles.container}>
      <ChannelSidebar
        selectedOption={selectedOption}
        onChangeOption={changeOptionHandler}
      />
      <ChannelList selectedOption={selectedOption} />
    </div>
  );
};
export default Channel;
