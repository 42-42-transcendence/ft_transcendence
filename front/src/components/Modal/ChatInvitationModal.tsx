import { Form } from 'react-router-dom';

import Modal from '../../UI/Modal';
import useCloseModal from './useCloseModal';

import styles from '../../styles/Modal.module.css';

const ChatInvitationModal = () => {
  const closeHandler = useCloseModal();

  return (
    <Modal onClose={closeHandler}>
      <Form method="POST">
        <div className={styles.header}>초대 하기</div>
        <div className={styles['input-field']}>
          <label className={styles.title}>닉네임</label>
          <input
            className={styles.input}
            type="text"
            name="name"
            maxLength={8}
            placeholder="닉네임 입력"
          />
        </div>
        <div className={styles.footer}>
          <button
            type="submit"
            className={`${styles['footer-button']} ${styles.confirm}`}
          >
            SEND
          </button>
          <button
            type="button"
            className={`${styles['footer-button']} ${styles.cancel}`}
            onClick={closeHandler}
          >
            CANCEL
          </button>
        </div>
      </Form>
    </Modal>
  );
};
export default ChatInvitationModal;
