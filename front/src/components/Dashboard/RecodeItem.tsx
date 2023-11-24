import type { Recode } from '.';
import styles from '../../styles/Dashboard.module.css';
import AvatarImage from '../../UI/AvatarImage';

type Props = {
  recode: Recode;
};

const RecodeItem = ({ recode }: Props) => {
  return (
    <li className={styles.item}>
      <h3>VS</h3>
      <AvatarImage imageURI={recode.image} radius="64px" />
      <div>{recode.id}</div>
      <div className={recode.isWin ? styles.win : styles.lose}>
        {recode.score}
      </div>
      <div>{recode.type.toLocaleUpperCase()}</div>
      <div>
        <span className={styles.mode}>{recode.mode.toLocaleUpperCase()}</span>
        <div className={recode.isWin ? styles.win : styles.lose}>
          {recode.isWin ? 'WIM' : 'LOSE'}
        </div>
      </div>
    </li>
  );
};
export default RecodeItem;
