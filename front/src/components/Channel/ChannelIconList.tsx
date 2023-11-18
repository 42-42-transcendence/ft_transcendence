import plusIcon from '../../assets/plus-icon.svg';
import refreshIcon from '../../assets/refresh-icon.svg';
import styles from '../../styles/Channel.module.css';
import useOpenModal from '../../store/Modal/useOpenModal';

type Props = {
  onRefreshHandler: () => void;
};

const ChannelIconList = ({ onRefreshHandler }: Props) => {
  const openHandler = useOpenModal('showCreatingChatRoom');

  return (
    <ul className={styles.icons}>
      <li>
        <button className={styles.icon} onClick={openHandler}>
          <img src={plusIcon} alt="plus channel icon" />
        </button>
      </li>
      <li>
        <button className={styles.icon} onClick={onRefreshHandler}>
          <img src={refreshIcon} alt="refresh channel icon" />
        </button>
      </li>
    </ul>
  );
};
export default ChannelIconList;
