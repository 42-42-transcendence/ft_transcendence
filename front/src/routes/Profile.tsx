import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const params = useParams();
  const userID = params.userID || '본인 아이디';
  return (
    <>
      <h1>Profile Page</h1>
      <h3>아이디: {userID}</h3>
    </>
  );
};
export default ProfilePage;
