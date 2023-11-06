import settingsIcon from '../../assets/setting-icon.svg';
import addUserIcon from '../../assets/add-user-icon.svg';
import exitIcon from '../../assets/exit-icon.svg';

import styles from '../../styles/Chatting.module.css';

const ChattingSettingList = () => {
  return (
    <ul className={styles['setting-icon-list']}>
      <li>
        <button className={styles['icon-button']}>
          <img src={settingsIcon} alt="setting icon" />
        </button>
      </li>
      <li>
        <button className={styles['icon-button']}>
          <img src={addUserIcon} alt="adduser icon" />
        </button>
      </li>
      <li>
        <button className={styles['icon-button']}>
          <img src={exitIcon} alt="exit icon" />
        </button>
      </li>
    </ul>
  );
};
export default ChattingSettingList;
