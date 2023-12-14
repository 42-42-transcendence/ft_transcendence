import styles from '../styles/Login.module.css';
import ftLogo from '../assets/42logo.svg';
import { Link, useLocation } from 'react-router-dom';

const redirectURL = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6ca3ccc53db831d81b21f64a88968dd3a883d67e1b003960893bc2bb21f9a31d&redirect_uri=http%3A%2F%2F${process.env.REACT_APP_HOST_DOMAIN}%3A3000%2Foauth&response_type=code`;
// const redirectURL = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6d75e45537dfe63cb877db3a4a1fdc80d44a07866b83d40b693a2c147c0787da&redirect_uri=http%3A%2F%2F${process.env.REACT_APP_HOST_DOMAIN}%3A3000%2Foauth&response_type=code`;

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
