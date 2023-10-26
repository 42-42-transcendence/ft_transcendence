import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';

import HeaderNavigation from '../components/HeaderNavigation';

const HeaderRayout = () => {
  return (
    <Fragment>
      <HeaderNavigation />
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
};
export default HeaderRayout;
