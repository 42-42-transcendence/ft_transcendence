import styles from '../styles/Login.module.css';
import ftLogo from '../assets/42logo.svg';
import { Link, useNavigate, useSubmit } from 'react-router-dom';

const LoginPage = () => {
  const clickHandler = async () => {};

  return (
    <>
      <div className={styles.login}>
        <img src={ftLogo} alt="42 icon" />
        <h1>FT_Transcendence</h1>
        <button onClick={clickHandler}>
          <img src={ftLogo} alt="42 icon" />
          <span>Intra Login</span>
        </button>
        <Link to="https://api.intra.42.fr/oauth/authorize?client_id{preo}}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fuser%2Foauth&response_type=code">
          Login
        </Link>
      </div>
    </>
  );
};
export default LoginPage;
