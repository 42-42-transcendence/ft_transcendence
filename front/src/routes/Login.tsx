import styles from '../styles/Login.module.css';
import ftLogo from '../assets/42logo.svg';
import { Link, LoaderFunctionArgs, json, redirect } from 'react-router-dom';

const LoginPage = () => {
  const redirectURL = process.env.REACT_APP_REDIRECT_URL;

  return (
    <div className={styles.login}>
      <img src={ftLogo} alt="42 icon" />
      <h1>FT_Transcendence</h1>
      <Link to={redirectURL as string}>
        <img src={ftLogo} alt="42 icon" />
        <span>Intra Login</span>
      </Link>
    </div>
  );
};
export default LoginPage;

export const getTokenLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const authCode = url.searchParams.get('code');

  const res = await fetch('http://localhost:3001/api/auth', {
    method: 'POST',
    body: JSON.stringify({ code: authCode }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw json({ message: '로그인에 실패하였습니다' }, { status: 500 });
  }

  const data = await res.json();

  console.log(data);
  // 분기
  return null;
};
