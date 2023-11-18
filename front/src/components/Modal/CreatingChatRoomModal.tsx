import Modal from '../../UI/Modal';
import useRequest from '../../http/useRequest';
import useCloseModal from '../../store/Modal/useCloseModal';

import styles from '../../styles/Modal.module.css';
import { useState } from 'react';

type Props = {
  onRefreshChannel: () => void;
};

const CreatingChatRoomModal = ({ onRefreshChannel }: Props) => {
  const closeHandler = useCloseModal();

  const [enteredType, setEnteredType] = useState<string>('public');
  const [enteredTitle, setEnteredTitle] = useState<string>('');
  const [enteredPassword, setEnteredPassword] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');

  const { isLoading, error, request } = useRequest();

  const changeTypeHandler = (e: React.MouseEvent<HTMLInputElement>) => {
    setEnteredType(e.currentTarget.value);
    if (e.currentTarget.value === 'private') {
      setEnteredPassword('');
    }
  };

  const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredTitle(e.target.value);
  };

  const changePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredPassword(e.target.value);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (enteredTitle.length === 0) {
      setErrorMessage('방 제목을 입력하세요.');
      return;
    }

    const bodyData = {
      type: enteredType,
      title: enteredTitle,
      password: enteredPassword,
    };

    const response = await request<string>(
      'http://localhost:3001/api/channel',
      {
        method: 'POST',
        body: JSON.stringify(bodyData),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response === null) {
      setErrorMessage(error);
    } else {
      onRefreshChannel();
      closeHandler();
    }
  };

  return (
    <Modal onClose={closeHandler}>
      <form method="POST" onSubmit={submitHandler}>
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
        {isLoading && <div className={styles['form-loading']}>..loading..</div>}
        <div className={styles['form-error']}>{errorMessage}</div>
        <div className={styles.footer}>
          <button
            type="submit"
            className={`${styles['footer-button']} ${styles.confirm}`}
          >
            CREATE
          </button>
          <button
            type="button"
            className={`${styles['footer-button']} ${styles.cancel}`}
            onClick={closeHandler}
          >
            CANCEL
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default CreatingChatRoomModal;
