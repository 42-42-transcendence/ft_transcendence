import { useState } from 'react';
import styles from '../../styles/Chatting.module.css';
import { Socket } from 'socket.io-client';

type Props = {
  socket: Socket | null;
  channelID: string;
};

const ChattingForm = ({ socket, channelID }: Props) => {
  const [enteredInput, setEnteredInput] = useState<string>('');

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredInput(e.target.value);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (enteredInput.trim().length === 0 || enteredInput.length > 50) {
      return;
    }

    if (!socket) {
      return;
    }

    socket.emit('sendMessage', { channelID, message: enteredInput });
    setEnteredInput('');
  };

  return (
    <>
      <form onSubmit={submitHandler} className={styles.form}>
        <input
          type="text"
          name="chat"
          maxLength={50}
          placeholder="메시지를 입력하세요."
          className={styles.input}
          value={enteredInput}
          onChange={inputChangeHandler}
          autoComplete="off"
        />
        <button
          type="submit"
          className={styles.submit}
          disabled={enteredInput.length === 0}
        >
          전송
        </button>
      </form>
    </>
  );
};
export default ChattingForm;
