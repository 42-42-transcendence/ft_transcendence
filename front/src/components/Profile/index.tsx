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
import editIcon from '../../assets/edit-icon.svg';
import useUserState from '../../store/User/useUserState';

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
  const userState = useUserState();

  const showAchievementDetail = useModalState('showAchievementDetail');

  const fetchProfile = useCallback(async () => {
    const ret = await request<ProfileInfo>(
      `${SERVER_URL}/api/user/profile/${params.userID}`,
      {
        method: 'GET',
      }
    );

    setProfileInfo(ret);
  }, [request, params]);

  useEffect(() => {
    fetchProfile();
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
    setFeedbackMessage('');

    const formData = new FormData();
    if (enteredAvatarFile !== null)
      formData.append('avatar', enteredAvatarFile);
    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/user/setup/avatar`,
      {
        method: 'PATCH',
        body: formData,
      }
    );

    if (ret !== null) {
      fetchProfile();
    }
  };

  if (isLoading) return <img src={loadingImage} alt="loading" />;
  else if (profileInfo === null)
    return <h1>유저 정보를 불러 올 수 없습니다.</h1>;

  const avatarFileURL =
    enteredAvatarFile === null
      ? profileInfo.image
      : URL.createObjectURL(enteredAvatarFile);

  let avatarContents = (
    <>
      <label className={styles['avatar-label']} htmlFor="avatar">
        <AvatarImage imageURI={avatarFileURL} radius={'240px'} />
        <input
          type="file"
          id="avatar"
          name="avatar"
          onChange={avatarChangeHandler}
          hidden={true}
        />
        <div className={styles['edit-icon-wrapper']}>
          <img
            className={styles['edit-icon']}
            src={editIcon}
            alt="avatar edit icon"
          />
        </div>
      </label>
      <button
        className={styles['avatar-patch-button']}
        onClick={avatarPatchHandler}
      >
        Apply
      </button>
      <span className={styles.feedback}>{feedbackMessage}</span>
    </>
  );

  if (params.userID !== userState.id) {
    avatarContents = <AvatarImage imageURI={avatarFileURL} radius={'240px'} />;
  }

  return (
    <>
      <div className={styles.profile}>
        <div className={styles.avatar}>
          <h1>{profileInfo.nickname}</h1>
          {avatarContents}
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
