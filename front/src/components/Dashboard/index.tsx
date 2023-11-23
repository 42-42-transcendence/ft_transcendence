import { useEffect, useState } from 'react';

import styles from '../../styles/Dashboard.module.css';
import DashboardSidebar from './DashboardSidebar';
import RecodeList from './RecodeList';
import useRequest from '../../http/useRequest';
import { SERVER_URL } from '../../App';
import { useParams } from 'react-router-dom';

export type Recode = {
  id: string;
  nickname: string;
  image: string;
  mode: 'normal' | 'fast' | 'object';
  isWin: boolean;
  type: 'ladder' | 'friendly';
  score: string;
};

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState<string>('all');
  const [recodes, setRecodes] = useState<Recode[]>([]);
  const { request } = useRequest();
  const params = useParams();

  useEffect(() => {
    const fetchRecodes = async () => {
      const ret = await request<Recode[]>(
        `${SERVER_URL}/api/dashboard/${params.userID}`,
        {
          method: 'GET',
        }
      );

      if (ret === null) return;

      setRecodes(ret);
    };

    fetchRecodes();
  }, [request, params]);

  const changeOptionHandler = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className={styles.container}>
      <DashboardSidebar
        selectedOption={selectedOption}
        onChangeOption={changeOptionHandler}
      />
      <RecodeList
        filteredRecodes={recodes.filter(
          (recode) => recode.type === selectedOption || selectedOption === 'all'
        )}
      />
    </div>
  );
};
export default Dashboard;
