import CardButton from '../../UI/CardButton';
import styles from '../../styles/Profile.module.css';
import useOpenModal from '../Modal/useOpenModal';

type Props = {
  title: string;
  description: string;
  isAchieved: boolean;
  onShowDetail: (title: string, description: string) => void;
};

const AchievementItem = ({
  title,
  description,
  isAchieved,
  onShowDetail,
}: Props) => {
  const openModal = useOpenModal('showAchievementDetail');
  const clickHandler = () => {
    openModal();
    onShowDetail(title, description);
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
