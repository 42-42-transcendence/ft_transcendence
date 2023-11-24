import { useEffect, useState } from 'react';
import AvatarImage from '../../UI/AvatarImage';
import Card from '../../UI/Card';

import styles from '../../styles/Profile.module.css';
import loadingImage from '../../assets/loading.gif';
import useModalState from '../../store/Modal/useModalState';
import AchievementItem from './AchievementItem';
import AchievementDetailModal from '../Modal/AchievementDetailModal';
import useRequest from '../../http/useRequest';
import { useParams } from 'react-router-dom';
import { SERVER_URL } from '../../App';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  isAchieved: boolean;
};

export type ProfileInfo = {
  nickname: string;
  image: string;
  winCount: number;
  loseCount: number;
  ladderPoint: number;
  achievements: Achievement[];
};

const Profile = () => {
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const { isLoading, request } = useRequest();
  const params = useParams();

  const showAchievementDetail = useModalState('showAchievementDetail');

  useEffect(() => {
    const fetchProfile = async () => {
      const ret = await request<ProfileInfo>(
        `${SERVER_URL}/api/profile/${params.userID}`,
        {
          method: 'GET',
        }
      );

      setProfileInfo(ret);
    };

    fetchProfile();
  }, [request, params]);

  const [activedAchievement, setActivedAchievement] = useState<{
    title: string;
    description: string;
  }>({ title: '', description: '' });

  const onActiveAchivement = (title: string, description: string) => {
    setActivedAchievement({ title, description });
  };

  if (isLoading) return <img src={loadingImage} alt="loading" />;
  else if (profileInfo === null)
    return <h1>유저 정보를 불러 올 수 없습니다.</h1>;
  return (
    <>
      <div className={styles.profile}>
        <div className={styles.avatar}>
          <h1>{profileInfo.nickname}</h1>
          <AvatarImage imageURI={profileInfo.image} radius={'240px'} />
        </div>
        <div className={styles.detail}>
          <Card className={`${styles.grid} ${styles.winCount}`}>
            <h2>승리</h2>
            <div className={styles.info}>
              <div className={styles.number}>{profileInfo.winCount}</div>
              <span>승</span>
            </div>
          </Card>
          <Card className={`${styles.grid} ${styles.loseCount}`}>
            <h2>패배</h2>
            <div className={styles.info}>
              <div className={styles.number}>{profileInfo.loseCount}</div>
              <span>패</span>
            </div>
          </Card>
          <Card className={`${styles.grid} ${styles.ladderPoint}`}>
            <h2>레더 점수</h2>
            <div className={styles.info}>
              <div className={styles.number}>{profileInfo.ladderPoint}</div>
              <span>LP</span>
            </div>
          </Card>
          <Card className={`${styles.grid} ${styles.achievement}`}>
            {profileInfo.achievements.map((item) => (
              <AchievementItem
                key={item.id}
                id={item.id}
                isAchieved={item.isAchieved}
                title={item.title}
                description={item.description}
                onShowDetailAchievement={onActiveAchivement}
              />
            ))}
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
