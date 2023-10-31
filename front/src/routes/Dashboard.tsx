import { useParams } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

const DashboardPage = () => {
  const params = useParams();
  const userID = params.userID || '본인 아이디';
  console.log('dashboard 전적 검색 ===> ', userID);
  return (
    <>
      <h1>Dashboard Page</h1>
      <Dashboard />
    </>
  );
};
export default DashboardPage;
