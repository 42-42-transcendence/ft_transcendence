import { useSubmit } from 'react-router-dom';

import logo from '../assets/42logo.svg';
import classes from '../styles/LoginRedirectPage.module.css';

const LoginRedirectPage = () => {
  const submit = useSubmit();

  const redirectHandler = () => {
    submit(null, { method: 'GET', action: '/' });
  };

  return (
    <div className={classes.content}>
      <img src={logo} alt="42logo.svg" />
      <h1>ft_transcendence</h1>
      <button onClick={redirectHandler}>ENTER</button>
    </div>
  );
};
export default LoginRedirectPage;
