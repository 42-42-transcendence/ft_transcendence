import { Form, useSubmit } from 'react-router-dom';
import Modal from '../../UI/Modal';
import useCloseModal from '../../store/Modal/useCloseModal';

import styles from '../../styles/Modal.module.css';
import { useState } from 'react';

const ChatRoomConfigModal = () => {
  const submit = useSubmit();
  const closeHandler = useCloseModal();

  const [selectedType, setSelectedType] = useState<string>('public');
  const [enteredName, setEnteredName] = useState<string>('');
  const [enteredPassword, setEnteredPassword] = useState<string>('');

  const clickHandler = (e: React.MouseEvent<HTMLInputElement>) => {
    setSelectedType(e.currentTarget.value);
    if (e.currentTarget.value === 'private') {
      setEnteredPassword('');
    }
  };

  const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredName(e.target.value);
  };

  const changePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredPassword(e.target.value);
  };

  const onDeleteHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    submit(null, { method: 'DELETE' });
  };

  return (
    <Modal onClose={closeHandler}>
      <Form method="PATCH">
        <div className={styles.header}>채팅방 설정</div>
        <div className={styles['input-field']}>
          <div className={styles.title}>종류</div>
          <div className={styles.toggle}>
            <label htmlFor="public">
              PUBLIC
              <input
                type="radio"
                name="room-type"
                id="public"
                value="public"
                defaultChecked={true}
                onClick={clickHandler}
              />
            </label>
            <label htmlFor="private">
              PRIVATE
              <input
                type="radio"
                name="room-type"
                id="private"
                value="private"
                onClick={clickHandler}
              />
            </label>
          </div>
        </div>
        <div className={styles['input-field']}>
          <label className={styles.title}>제목</label>
          <input
            className={styles.input}
            type="text"
            name="room-name"
            maxLength={20}
            placeholder="방 제목 입력"
            value={enteredName}
            onChange={changeNameHandler}
          />
        </div>
        <div className={styles['input-field']}>
          <label className={styles.title}>비밀번호</label>
          <input
            className={styles.input}
            type="password"
            name="room-password"
            maxLength={8}
            placeholder={
              selectedType === 'private' ? '' : '비밀번호 입력 (최대 8자)'
            }
            value={enteredPassword}
            onChange={changePasswordHandler}
            disabled={selectedType === 'private'}
          />
        </div>
        <div className={styles.footer}>
          <button
            type="submit"
            className={`${styles['footer-button']} ${styles.confirm}`}
          >
            EDIT
          </button>
          <button
            type="button"
            className={`${styles['footer-button']} ${styles.delete}`}
            onClick={onDeleteHandler}
          >
            DELETE
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
export default ChatRoomConfigModal;
