import { useNavigate } from 'react-router-dom';

import styles from '../styles/Login.module.css';
import ftLogo from '../assets/42logo.svg';

const LoginPage = () => {
  const navigate = useNavigate();
  const clickHandler = () => {
    navigate('/two-factor-auth');
  };

  return (
    <main>
      <div className={styles.login}>
        <img src={ftLogo} alt="42 icon" />
        <h1>FT_Transcendence</h1>
        <button onClick={clickHandler}>
          <img src={ftLogo} alt="42 icon" />
          <span>Intra Login</span>
        </button>
      </div>
    </main>
  );
};
export default LoginPage;
