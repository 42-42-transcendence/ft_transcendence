import { useEffect, useState } from 'react';
import Modal from '../../UI/Modal';
import useCloseModal from '../../store/Modal/useCloseModal';
import styles from '../../styles/Modal.module.css';
import useRequest from '../../http/useRequest';
import { SERVER_URL } from '../../App';

type Props = {
  onRefreshHandler: () => void;
};
const AddFriendModal = ({ onRefreshHandler }: Props) => {
  const [enteredNickname, setEnteredNickName] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [successModalMessage, setSuccessModalMessage] = useState<string>('');
  const { isLoading, error, request } = useRequest();
  const closeModalHandler = useCloseModal();

  useEffect(() => {
    if (error) {
      setFeedbackMessage(error);
    }
  }, [error]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredNickName(e.target.value);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      enteredNickname.trim().length < 4 ||
      enteredNickname.trim().length > 8
    ) {
      setFeedbackMessage('닉네임 길이는 4~8자 입니다.');
      return;
    }
    setFeedbackMessage('');

    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/relation/friend/${enteredNickname}`,
      {
        method: 'GET',
      }
    );

    if (ret !== null) {
      setSuccessModalMessage('요청에 성공하였습니다.');
      onRefreshHandler();
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
        <div className={styles.header}>친구 요청</div>
        <div className={styles['input-field']}>
          <label className={styles.title}>닉네임</label>
          <input
            className={styles.input}
            type="text"
            name="name"
            maxLength={8}
            placeholder="닉네임 입력"
            onChange={changeHandler}
            value={enteredNickname}
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
export default AddFriendModal;
