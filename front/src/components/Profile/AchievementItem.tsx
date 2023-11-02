import CardButton from '../../UI/CardButton';
import styles from '../../styles/Profile.module.css';

type Props = {
  title: string;
  isAchieved: boolean;
};
const AchievementItem = ({ title, isAchieved }: Props) => {
  const clickHandler = () => {
    console.log('modal');
  };

  const classes = `${styles.item} ${isAchieved ? styles.achieved : ''}`;

  return (
    <CardButton
      className={classes}
      clickHandler={clickHandler}
      disabled={!isAchieved}
    >
      {title}
    </CardButton>
  );
};
export default AchievementItem;
