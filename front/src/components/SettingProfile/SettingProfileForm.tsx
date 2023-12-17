import styles from '../../styles/SettingProfileForm.module.css';
import defaultThumNailURI from '../../assets/default.jpeg';
import AvatarImage from '../../UI/AvatarImage';
import { useEffect, useState } from 'react';
import { SERVER_URL } from '../../App';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions as authActions } from '../../store/Auth/auth';
import useRequest from '../../http/useRequest';
import loadingImage from '../../assets/loading.gif';
import editIcon from '../../assets/edit-icon.svg';

type Props = {
  jwtToken: string;
};

const SettingProfileForm = ({ jwtToken }: Props) => {
  const [enteredAvatarFile, setEnteredAvatarFile] = useState<File | null>(null);
  const [enteredName, setEnteredName] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const { isLoading, error, request } = useRequest();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      setFeedbackMessage(error);
    }
  }, [error]);

  const avatarFileURI =
    enteredAvatarFile === null
      ? defaultThumNailURI
      : URL.createObjectURL(enteredAvatarFile);

  const avatarChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files.length !== 1) return;
    setEnteredAvatarFile(e.target.files[0]);
  };

  const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredName(e.target.value);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (enteredAvatarFile !== null) {
      if (!enteredAvatarFile.type.startsWith('image')) {
        setFeedbackMessage('올바른 이미지 형식이 아닙니다.');
        return;
      }
      if (enteredAvatarFile.size > 3 * 1024 * 1024) {
        setFeedbackMessage('이미지 파일 크기는 최대 3MB입니다.');
        return;
      }
    }

    if (enteredName.trim().length < 4 || enteredName.trim().length > 8) {
      setFeedbackMessage('닉네임 길이는 4~8자 입니다.');
      return;
    }
    setFeedbackMessage('');

    const responseName = await request<{ message: string }>(
      `${SERVER_URL}/api/user/setup/nickname`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwtToken,
        },
        body: JSON.stringify({ userID: enteredName }),
      }
    );
    if (responseName === null) return;

    const formData = new FormData();
    if (enteredAvatarFile !== null) {
      formData.append('avatar', enteredAvatarFile);
    }

    const responseFile = await request<{ message: string }>(
      `${SERVER_URL}/api/user/setup/avatar`,
      {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: 'Bearer ' + jwtToken,
        },
      }
    );
    if (responseFile === null) return;

    dispatch(authActions.setAuthToken(jwtToken));
    navigate('/', { replace: true });
  };

  return (
    <form className={styles.form} onSubmit={submitHandler}>
      <div className={styles.avatar}>
        <label htmlFor="avatar" className={styles['avatar-label']}>
          <div>프로필 이미지</div>
          <div>
            <AvatarImage imageURI={avatarFileURI} radius="200px" />
          </div>
          <div className={styles['edit-icon-wrapper']}>
            <img src={editIcon} alt="avatar edit icon" />
          </div>
        </label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          onChange={avatarChangeHandler}
        />
      </div>
      <div className={styles.name}>
        <label htmlFor="name">닉네임</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="닉네임 입력 (4~8자)"
          maxLength={8}
          value={enteredName}
          onChange={nameChangeHandler}
          autoComplete="off"
        />
      </div>
      <span className={styles.feedback}>{feedbackMessage}</span>
      <button className={styles.submit} disabled={isLoading}>
        제 출
      </button>
      {isLoading && <img src={loadingImage} alt="loading" />}
    </form>
  );
};

export default SettingProfileForm;
