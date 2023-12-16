import styles from '../styles/Login.module.css';
import ftLogo from '../assets/42logo.svg';
import { Link, useLocation } from 'react-router-dom';

const redirectURL = `${process.env.REACT_APP_HOST_REDIRECT_URI}`;

const LoginPage = () => {
  const location = useLocation();

  return (
    <div className={styles.login}>
      {location.state?.message && <small>{location.state?.message}</small>}
      <img src={ftLogo} alt="42 icon" />
      <h1>FT_Transcendence</h1>
      <Link to={redirectURL as string} replace={true}>
        <img src={ftLogo} alt="42 icon" />
        <span>Intra Login</span>
      </Link>
    </div>
  );
};

export default LoginPage;
