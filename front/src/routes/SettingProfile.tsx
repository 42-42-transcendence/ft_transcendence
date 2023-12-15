import { Navigate, useLocation } from 'react-router-dom';
import SettingProfileForm from '../components/SettingProfile/SettingProfileForm';

const SettingProfilePage = () => {
  const location = useLocation();
  const jwtToken = location.state?.jwtToken;

  if (!jwtToken) {
    return <Navigate to="/" replace={true} />;
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
