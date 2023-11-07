import settingsIcon from '../../assets/setting-icon.svg';
import addUserIcon from '../../assets/add-user-icon.svg';
import exitIcon from '../../assets/exit-icon.svg';

import styles from '../../styles/Chatting.module.css';
import useOpenModal from '../Modal/useOpenModal';

const ChattingSettingList = () => {
  const openConfigModalHandler = useOpenModal('showChatRoomConfig');
  const openInvitationModalHandler = useOpenModal('showChatInvitation');
  const openExitModalHandler = useOpenModal('showChatExitConfirm');

  return (
    <ul className={styles['setting-icon-list']}>
      <li>
        <button
          className={styles['icon-button']}
          onClick={openConfigModalHandler}
        >
          <img src={settingsIcon} alt="setting icon" />
        </button>
      </li>
      <li>
        <button
          className={styles['icon-button']}
          onClick={openInvitationModalHandler}
        >
          <img src={addUserIcon} alt="adduser icon" />
        </button>
      </li>
      <li>
        <button
          className={styles['icon-button']}
          onClick={openExitModalHandler}
        >
          <img src={exitIcon} alt="exit icon" />
        </button>
      </li>
    </ul>
  );
};
export default ChattingSettingList;
