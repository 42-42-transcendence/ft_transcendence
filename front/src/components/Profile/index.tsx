import AvatarImage from '../../UI/AvatarImage';
import Card from '../../UI/Card';

import styles from '../../styles/Profile.module.css';
import AchievementItem from './AchievementItem';

type DUMMY_ACHIEVE = {
  id: string;
  title: string;
  description: string;
};

type DUMMY_USER_TYPE = {
  id: string;
  imageURL: string;
  winCount: number;
  loseCount: number;
  ladderPoint: number;
  achievement: DUMMY_ACHIEVE[];
};

const DUMMY_USER: DUMMY_USER_TYPE = {
  id: '이지수',
  imageURL:
    'https://images.unsplash.com/photo-1698444214003-dfdea976064a?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8',
  winCount: 13,
  loseCount: 8,
  ladderPoint: 1234,
  achievement: [
    {
      id: '1',
      title: '🥇',
      description: 'Welcome 42 Pong',
    },
    {
      id: '2',
      title: '🏆',
      description: 'Congratulations! First Victory Achieved!',
    },
    {
      id: '3',
      title: '👑',
      description: 'Flawless Victory',
    },
  ],
};

const Profile = () => {
  const achievementList = [];
  for (let i = 0; i < 10; ++i) {
    const isAchieved = i < DUMMY_USER.achievement.length;
    const title = isAchieved ? DUMMY_USER.achievement[i].title : '';

    achievementList.push(
      <AchievementItem key={i} isAchieved={isAchieved} title={title} />
    );
  }

  return (
    <div className={styles.profile}>
      <div className={styles.avatar}>
        <h1>{DUMMY_USER.id}</h1>
        <AvatarImage imageURI={DUMMY_USER.imageURL} radius={'240px'} />
      </div>
      <div className={styles.detail}>
        <Card className={`${styles.grid} ${styles.winCount}`}>
          <h2>승리</h2>
          <div className={styles.info}>
            <div className={styles.number}>{DUMMY_USER.winCount}</div>
            <span>승</span>
          </div>
        </Card>
        <Card className={`${styles.grid} ${styles.loseCount}`}>
          <h2>패배</h2>
          <div className={styles.info}>
            <div className={styles.number}>{DUMMY_USER.loseCount}</div>
            <span>패</span>
          </div>
        </Card>
        <Card className={`${styles.grid} ${styles.ladderPoint}`}>
          <h2>레더 점수</h2>
          <div className={styles.info}>
            <div className={styles.number}>{DUMMY_USER.ladderPoint}</div>
            <span>LP</span>
          </div>
        </Card>
        <Card className={`${styles.grid} ${styles.achievement}`}>
          {achievementList}
        </Card>
      </div>
    </div>
  );
};
export default Profile;
