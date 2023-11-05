import SettingsIcon from '../../assets/settings-icon';

import styles from '../../styles/Chatting.module.css';

const ChattingSettingsButton = () => {
  const clickHandler = () => {};

  return (
    <button onClick={clickHandler} className={styles.setting}>
      <SettingsIcon />
    </button>
  );
};
export default ChattingSettingsButton;
