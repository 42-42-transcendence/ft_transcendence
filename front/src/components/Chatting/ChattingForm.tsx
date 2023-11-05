import { useState } from 'react';
import styles from '../../styles/Chatting.module.css';

const ChattingForm = () => {
  const [enteredInput, setEnteredInput] = useState<string>('');

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredInput(e.target.value);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEnteredInput('');
  };

  return (
    <form onSubmit={submitHandler} className={styles.form}>
      <input
        type="text"
        name="chat"
        maxLength={100}
        placeholder="메시지를 입력하세요."
        className={styles.input}
        value={enteredInput}
        onChange={inputChangeHandler}
      />
      <button type="submit" className={styles.submit}>
        전송
      </button>
    </form>
  );
};
export default ChattingForm;
