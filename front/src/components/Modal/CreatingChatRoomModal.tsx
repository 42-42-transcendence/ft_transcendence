import { SERVER_URL } from '../../App';
import Modal from '../../UI/Modal';
import useRequest from '../../http/useRequest';
import useCloseModal from '../../store/Modal/useCloseModal';

import styles from '../../styles/Modal.module.css';
import { useEffect, useState } from 'react';
import { ChannelType } from '../Channel';
import { useNavigate } from 'react-router-dom';

const CreatingChatRoomModal = () => {
  const navigate = useNavigate();
  const closeHandler = useCloseModal();

  const [enteredType, setEnteredType] = useState<string>('public');
  const [enteredTitle, setEnteredTitle] = useState<string>('');
  const [enteredPassword, setEnteredPassword] = useState<string>('');

  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const { isLoading, error, request } = useRequest();

  useEffect(() => {
    if (error) {
      setFeedbackMessage(error);
    }
  }, [error]);

  const changeTypeHandler = (e: React.MouseEvent<HTMLInputElement>) => {
    setEnteredType(e.currentTarget.value);
    if (e.currentTarget.value === 'private') {
      setEnteredPassword('');
    }
  };

  const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredTitle(e.target.value);
    if (e.target.value.trim().length > 0) setFeedbackMessage('');
  };

  const changePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredPassword(e.target.value);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (enteredTitle.trim().length === 0) {
      setFeedbackMessage('방 제목을 입력하세요.');
      return;
    }
    setFeedbackMessage('');

    const bodyData = {
      type: enteredType,
      title: enteredTitle,
      password: enteredPassword,
    };

    const ret = await request<ChannelType>(`${SERVER_URL}/api/channel`, {
      method: 'POST',
      body: JSON.stringify(bodyData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (ret !== null) {
      closeHandler();
      navigate(`/chatting/${ret.channelID}`, {
        state: { redirect: true },
      });
    }
  };

  return (
    <Modal onClose={closeHandler}>
      <form onSubmit={submitHandler}>
        <div className={styles.header}>채팅방 만들기</div>
        <div className={styles['input-field']}>
          <div className={styles.title}>종류</div>
          <div className={styles.toggle}>
            <label htmlFor="public">
              PUBLIC
              <input
                type="radio"
                name="type"
                id="public"
                value="public"
                defaultChecked={true}
                onClick={changeTypeHandler}
              />
            </label>
            <label htmlFor="private">
              PRIVATE
              <input
                type="radio"
                name="type"
                id="private"
                value="private"
                onClick={changeTypeHandler}
              />
            </label>
          </div>
        </div>
        <div className={styles['input-field']}>
          <label className={styles.title}>제목</label>
          <input
            className={styles.input}
            type="text"
            maxLength={20}
            placeholder="방 제목 입력 (최대 20자)"
            value={enteredTitle}
            onChange={changeNameHandler}
            autoComplete="off"
          />
        </div>
        <div className={styles['input-field']}>
          <label className={styles.title}>비밀번호</label>
          <input
            className={styles.input}
            type="password"
            maxLength={8}
            placeholder={
              enteredType === 'private' ? '' : '비밀번호 입력 (최대 8자)'
            }
            value={enteredPassword}
            onChange={changePasswordHandler}
            disabled={enteredType === 'private'}
          />
        </div>
        <div className={styles.feedback}>{feedbackMessage}</div>
        <div className={styles.footer}>
          <button
            type="submit"
            className={`${styles['footer-button']} ${styles.confirm}`}
            disabled={isLoading}
          >
            CREATE
          </button>
          <button
            type="button"
            className={`${styles['footer-button']} ${styles.cancel}`}
            onClick={closeHandler}
            disabled={isLoading}
          >
            CANCEL
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default CreatingChatRoomModal;
