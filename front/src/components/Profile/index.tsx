import { useCallback, useEffect, useState } from 'react';
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

// const DUMMY = {
//   nickname: 'heryu',
//   image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
//   winCount: 12,
//   loseCount: 8,
//   ladderPoint: 1200,
//   achievements: [
//     { id: '1', title: 'asdf', description: 'haha', isAchieved: true },
//     { id: '2', title: 'asdf', description: 'haha', isAchieved: true },
//     { id: '3', title: 'asdf', description: 'haha', isAchieved: true },
//     { id: '4', title: 'asdf', description: 'haha', isAchieved: true },
//     { id: '5', title: 'asdf', description: 'haha', isAchieved: true },
//     { id: '6', title: 'asdf', description: 'haha', isAchieved: true },
//     { id: '7', title: 'asdf', description: 'haha', isAchieved: true },
//     { id: '8', title: 'asdf', description: 'haha', isAchieved: true },
//     { id: '9', title: 'asdf', description: 'haha', isAchieved: true },
//     { id: '19', title: 'asdf', description: 'haha', isAchieved: true },
//   ],
// };

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
  const [enteredAvatarFile, setEnteredAvatarFile] = useState<File | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const { isLoading, error, request } = useRequest();
  const params = useParams();

  const showAchievementDetail = useModalState('showAchievementDetail');

  const fetchProfile = useCallback(async () => {
    const ret = await request<ProfileInfo>(
      `${SERVER_URL}/api/profile/${params.userID}`,
      {
        method: 'GET',
      }
    );

    setProfileInfo(ret);
  }, [request, params]);

  useEffect(() => {
    fetchProfile();
    // setProfileInfo(DUMMY);
  }, [fetchProfile]);

  useEffect(() => {
    setFeedbackMessage(error);
  }, [error]);

  const [activedAchievement, setActivedAchievement] = useState<{
    title: string;
    description: string;
  }>({ title: '', description: '' });

  const onActiveAchivement = (title: string, description: string) => {
    setActivedAchievement({ title, description });
  };

  const avatarChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files.length !== 1) return;
    setEnteredAvatarFile(e.target.files[0]);
  };

  const avatarPatchHandler = async () => {
    setEnteredAvatarFile(null);
    if (enteredAvatarFile === null) {
      setFeedbackMessage('입력된 파일이 없습니다.');
      return;
    } else if (!enteredAvatarFile.type.startsWith('image')) {
      setFeedbackMessage('올바른 이미지 형식이 아닙니다.');
      return;
    } else if (enteredAvatarFile.size > 3 * 1024 * 1024) {
      setFeedbackMessage('이미지 파일 크기는 최대 3MB입니다.');
      return;
    }

    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/user/setup`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: enteredAvatarFile,
      }
    );

    if (ret !== null) {
      fetchProfile();
      setFeedbackMessage(ret.message);
    }
  };

  if (isLoading) return <img src={loadingImage} alt="loading" />;
  else if (profileInfo === null)
    return <h1>유저 정보를 불러 올 수 없습니다.</h1>;

  const avatarFileURL =
    enteredAvatarFile === null
      ? profileInfo?.image
      : URL.createObjectURL(enteredAvatarFile);
  return (
    <>
      <div className={styles.profile}>
        <div className={styles.avatar}>
          <h1>{profileInfo.nickname}</h1>
          <label className={styles['avatar-label']} htmlFor="avatar">
            <AvatarImage imageURI={avatarFileURL} radius={'240px'} />
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={avatarChangeHandler}
              hidden={true}
            />
          </label>
          <button
            className={styles['avatar-patch-button']}
            onClick={avatarPatchHandler}
          >
            Apply
          </button>
          <span className={styles.feedback}>{feedbackMessage}</span>
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
