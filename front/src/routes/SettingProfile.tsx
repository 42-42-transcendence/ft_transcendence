import { Navigate, useLocation } from 'react-router-dom';
import SettingProfileForm from '../components/SettingProfile/SettingProfileForm';

const SettingProfilePage = () => {
  const location = useLocation();
  const jwtToken = location.state?.jwtToken;

  if (jwtToken === null) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <main>
      <h1>초기 설정</h1>
      <SettingProfileForm jwtToken={jwtToken} />
    </main>
  );
};

export default SettingProfilePage;
