import plusIcon from '../../assets/plus-icon.svg';
import refreshIcon from '../../assets/refresh-icon.svg';
import styles from '../../styles/Channel.module.css';
import useOpenModal from '../Modal/useOpenModal';

const ChannelIconList = () => {
  const openHandler = useOpenModal('showCreatingChatRoom');

  return (
    <ul className={styles.icons}>
      <li>
        <button className={styles.icon} onClick={openHandler}>
          <img src={plusIcon} alt="plus channel icon" />
        </button>
      </li>
      <li>
        <button className={styles.icon}>
          <img src={refreshIcon} alt="refresh channel icon" />
        </button>
      </li>
    </ul>
  );
};
export default ChannelIconList;
