import { useActionData } from 'react-router-dom';

import styles from '../../styles/SettingProfileForm.module.css';
import AvatarInput from './AvatarInput';
import NameInput from './NameInput';

type ActionData = { errorMessage: string } | undefined;

const InitProfileForm = () => {
  const actionData = useActionData() as ActionData;

  const erorrMessage = actionData?.errorMessage;

  return (
    <form className={styles.form}>
      <AvatarInput />
      <NameInput />
      <span className={styles.feedback}>{erorrMessage}</span>
      <button className={styles.submit}>완 료</button>
    </form>
  );
};

export default InitProfileForm;
