import { useNavigate } from 'react-router-dom';

const TwoFactorAuthPage = () => {
  const navigate = useNavigate();
  const clickHandler = () => {
    navigate('/setting-profile');
  };

  return (
    <main>
      <h1>2차 인증 페이지</h1>
      <button onClick={clickHandler}>Confirm</button>
    </main>
  );
};
export default TwoFactorAuthPage;
