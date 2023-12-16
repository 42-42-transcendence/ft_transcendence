import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

const RootLayout = () => {
  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </>
  );
};
export default RootLayout;
