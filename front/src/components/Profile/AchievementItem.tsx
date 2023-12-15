import CardButton from '../../UI/CardButton';
import styles from '../../styles/Profile.module.css';
import useOpenModal from '../../store/Modal/useOpenModal';
import type { Achievement } from '.';

type Props = Achievement & {
  onShowDetailAchievement: (title: string, description: string) => void;
};

const AchievementItem = ({
  title,
  description,
  isAchieved,
  onShowDetailAchievement,
}: Props) => {
  const openModal = useOpenModal('showAchievementDetail');
  const clickHandler = () => {
    openModal();
    onShowDetailAchievement(title, description);
  };

  const classes = `${styles.item} ${isAchieved ? styles.achieved : ''}`;

  return (
    <CardButton
      className={classes}
      clickHandler={clickHandler}
      disabled={!isAchieved}
    >
      {isAchieved && title}
    </CardButton>
  );
};
export default AchievementItem;
