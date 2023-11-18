import { useState } from 'react';
import Modal from '../../UI/Modal';
import useCloseModal from '../../store/Modal/useCloseModal';

import styles from '../../styles/Modal.module.css';
import { useNavigate } from 'react-router-dom';

type Props = {
  onPassowrdSubmit: (password: string) => Promise<void>;
};

const ChatPasswordModal = ({ onPassowrdSubmit }: Props) => {
  const navigate = useNavigate();
  const closeHandler = useCloseModal();

  const [enteredPassword, setEnteredPassword] = useState<string>('');

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredPassword(e.target.value);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (enteredPassword.length === 0) {
      return;
    }

    setEnteredPassword('');
    onPassowrdSubmit(enteredPassword);
  };

  const redirectHandler = () => {
    navigate('/channels');
    closeHandler();
  };

  return (
    <Modal>
      <form method="POST" onSubmit={submitHandler}>
        <div className={styles.header}>채팅방 비밀번호 필요</div>
        <div className={styles['input-field']}>
          <label className={styles.title}>비밀번호</label>
          <input
            className={styles.input}
            type="password"
            maxLength={8}
            placeholder="비밀번호 입력 (최대 8자)"
            value={enteredPassword}
            onChange={changeHandler}
          />
        </div>
        <div className={styles.footer}>
          <button
            type="submit"
            className={`${styles['footer-button']} ${styles.confirm}`}
          >
            SUBMIT
          </button>
          <button
            type="button"
            className={`${styles['footer-button']} ${styles.cancel}`}
            onClick={redirectHandler}
          >
            CANCEL
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default ChatPasswordModal;
