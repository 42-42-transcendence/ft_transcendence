import { useState } from 'react';

import styles from '../../styles/SettingProfileForm.module.css';

const NameInput = () => {
  const [enteredName, setEnteredName] = useState<string>('');

  const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredName(e.target.value);
  };

  return (
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
      />
    </div>
  );
};
export default NameInput;
