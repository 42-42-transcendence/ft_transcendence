import { useState } from 'react';

import styles from '../../styles/Dashboard.module.css';
import DashboardSidebar from './DashboardSidebar';
import DashboardList from './DashboardList';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState<string>('all');

  const changeOptionHandler = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className={styles.container}>
      <DashboardSidebar
        selectedOption={selectedOption}
        onChangeOption={changeOptionHandler}
      />
      <DashboardList selectedOption={selectedOption} />
    </div>
  );
};
export default Dashboard;
