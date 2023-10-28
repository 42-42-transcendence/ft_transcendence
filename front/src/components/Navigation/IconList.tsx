import styles from '../../styles/Navigation.module.css';

import SettingsIcon from '../../assets/SettingsIcon';
import LogoutIcon from '../../assets/LogoutIcon';

const IconList = () => {
  return (
    <ul className={styles.icon_list}>
      <li>
        <button>
          <SettingsIcon />
        </button>
      </li>
      <li>
        <button>
          <LogoutIcon />
        </button>
      </li>
    </ul>
  );
};

export default IconList;
