import { Navigate, useLocation } from 'react-router-dom';
import SettingProfileForm from '../components/SettingProfile/SettingProfileForm';
import useUserState from '../store/User/useUserState';

const SettingProfilePage = () => {
  const location = useLocation();
  const jwtToken = location.state?.jwtToken;
  const userState = useUserState();

  if (userState.id !== '') {
    return <Navigate to="/" replace={true} />;
  }

  if (jwtToken === null) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <main>
      <h1>초기 프로필 설정</h1>
      <p>아바타 및 닉네임을 설정하세요.</p>
      <SettingProfileForm jwtToken={jwtToken} />
    </main>
  );
};

export default SettingProfilePage;
