import { Navigate } from 'react-router-dom';
import SettingProfileForm from '../components/SettingProfile/SettingProfileForm';
import useAuthState from '../store/Auth/useAuthState';

const SettingProfilePage = () => {
  const authState = useAuthState();

  if (authState.myID !== '') return <Navigate to="/" />;

  return (
    <main>
      <h1>초기 설정</h1>
      <SettingProfileForm />
    </main>
  );
};

export default SettingProfilePage;
