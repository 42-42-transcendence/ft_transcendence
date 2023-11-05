import { useParams } from 'react-router-dom';
import Profile from '../components/Profile';

const ProfilePage = () => {
  const params = useParams();
  const userID = params.userID || '본인 아이디';
  console.log(userID);

  return (
    <>
      <h1>Profile Page</h1>
      <Profile />
    </>
  );
};
export default ProfilePage;
