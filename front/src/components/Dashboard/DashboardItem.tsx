import styles from '../../styles/Dashboard.module.css';
import AvatarImage from '../../UI/AvatarImage';

type Props = {
  id: string;
  image: string;
  mode: 'normal' | 'fast' | 'object';
  isWin: boolean;
  type: 'ladder' | 'friendly';
  score: string;
};

const DashboardItem = ({ id, image, mode, isWin, type, score }: Props) => {
  return (
    <li className={styles.item}>
      <h3>VS</h3>
      <AvatarImage imageURI={image} radius="64px" />
      <div>{id}</div>
      <div className={isWin ? styles.win : styles.lose}>{score}</div>
      <div>{type.toLocaleUpperCase()}</div>
      <div>
        <span className={styles.mode}>{mode.toLocaleUpperCase()}</span>
        <div className={isWin ? styles.win : styles.lose}>
          {isWin ? 'WIM' : 'LOSE'}
        </div>
      </div>
    </li>
  );
};
export default DashboardItem;
