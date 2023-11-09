import styles from '../styles/Login.module.css';
import ftLogo from '../assets/42logo.svg';

const LoginPage = () => {
  const clickHandler = async () => {
    const res = await fetch('http://localhost:3000/login');
    const data = await res.json();
    console.log(data);
  };

  return (
    <>
      <div className={styles.login}>
        <img src={ftLogo} alt="42 icon" />
        <h1>FT_Transcendence</h1>
        <button onClick={clickHandler}>
          <img src={ftLogo} alt="42 icon" />
          <span>Intra Login</span>
        </button>
      </div>
    </>
  );
};
export default LoginPage;
