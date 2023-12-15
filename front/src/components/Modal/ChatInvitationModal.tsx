import Modal from '../../UI/Modal';
import useCloseModal from '../../store/Modal/useCloseModal';

import styles from '../../styles/Modal.module.css';
import { useEffect, useState } from 'react';
import useRequest from '../../http/useRequest';
import { SERVER_URL } from '../../App';

type Props = {
  channelID: string;
};

const ChatInvitationModal = ({ channelID }: Props) => {
  const closeModalHandler = useCloseModal();

  const [enteredName, setEnteredName] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [successModalMessage, setSuccessModalMessage] = useState<string>('');
  const { isLoading, error, request } = useRequest();

  useEffect(() => {
    if (error) {
      setFeedbackMessage(error);
    }
  }, [error]);

  const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredName(e.target.value);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (enteredName.trim().length < 4 || enteredName.trim().length > 8) {
      setFeedbackMessage('닉네임 길이는 4 ~ 8자 입니다');
      return;
    }
    setFeedbackMessage('');

    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/channel/${channelID}/invite`,
      {
        method: 'POST',
        body: JSON.stringify({ targetUserID: enteredName }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (ret !== null) {
      setSuccessModalMessage('요청에 성공하였습니다.');
      setTimeout(() => {
        closeModalHandler();
      }, 1000);
    }
  };

  let contents: React.ReactNode = '';
  if (successModalMessage) {
    contents = (
      <h1 className={styles['success-message']}>{successModalMessage}</h1>
    );
  } else {
    contents = (
      <form onSubmit={submitHandler}>
        <div className={styles.header}>초대 하기</div>
        <div className={styles['input-field']}>
          <label className={styles.title}>닉네임</label>
          <input
            className={styles.input}
            type="text"
            name="name"
            maxLength={8}
            placeholder="닉네임 입력"
            value={enteredName}
            onChange={changeNameHandler}
            autoComplete="off"
          />
        </div>
        <div className={styles.feedback}>{feedbackMessage}</div>
        <div className={styles.footer}>
          <button
            type="submit"
            className={`${styles['footer-button']} ${styles.confirm}`}
            disabled={isLoading}
          >
            SEND
          </button>
          <button
            type="button"
            className={`${styles['footer-button']} ${styles.cancel}`}
            onClick={closeModalHandler}
            disabled={isLoading}
          >
            CANCEL
          </button>
        </div>
      </form>
    );
  }

  return <Modal onClose={closeModalHandler}>{contents}</Modal>;
};
export default ChatInvitationModal;
