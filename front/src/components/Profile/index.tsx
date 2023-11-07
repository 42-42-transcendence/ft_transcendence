import { useState } from 'react';
import AvatarImage from '../../UI/AvatarImage';
import Card from '../../UI/Card';

import styles from '../../styles/Profile.module.css';
import useModalState from '../Modal/useModalState';
import AchievementItem from './AchievementItem';
import AchievementDetailModal from '../Modal/AchievementDetailModal';

type DUMMY_ACHIEVE = {
  id: string;
  title: string;
  description: string;
  isAchieved: boolean;
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
      isAchieved: true,
    },
    {
      id: '2',
      title: '🏆',
      description: 'Congratulations! First Victory Achieved!',
      isAchieved: true,
    },
    {
      id: '3',
      title: '👑',
      description: 'Flawless Victory',
      isAchieved: true,
    },
    {
      id: '4',
      title: '👑',
      description: 'Flawless Victory',
      isAchieved: false,
    },
    {
      id: '5',
      title: '👑',
      description: 'Flawless Victory',
      isAchieved: false,
    },
    {
      id: '6',
      title: '👑',
      description: 'Flawless Victory',
      isAchieved: false,
    },
    {
      id: '7',
      title: '👑',
      description: 'Flawless Victory',
      isAchieved: false,
    },
    {
      id: '8',
      title: '👑',
      description: 'Flawless Victory',
      isAchieved: false,
    },
    {
      id: '9',
      title: '👑',
      description: 'Flawless Victory',
      isAchieved: false,
    },
    {
      id: '10',
      title: '👑',
      description: 'Flawless Victory',
      isAchieved: false,
    },
  ],
};

const Profile = () => {
  const showAchievementDetail = useModalState('showAchievementDetail');

  const [activedAchievement, setActivedAchievement] = useState<{
    title: string;
    description: string;
  }>({ title: '', description: '' });

  const onActiveAchivement = (title: string, description: string) => {
    setActivedAchievement({ title, description });
  };

  const achievementItemList = DUMMY_USER.achievement.map((item) => (
    <AchievementItem
      key={item.id}
      isAchieved={item.isAchieved}
      title={item.title}
      description={item.description}
      onShowDetail={onActiveAchivement}
    />
  ));

  return (
    <>
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
            {achievementItemList}
          </Card>
        </div>
      </div>
      {showAchievementDetail && (
        <AchievementDetailModal
          title={activedAchievement.title}
          description={activedAchievement.description}
        />
      )}
    </>
  );
};
export default Profile;
