import { useCallback, useEffect, useState } from 'react';

import styles from '../../styles/Social.module.css';
import SocialList from './SocialList';
import SocialSidebar from './SocialSidebar';
import SocialIconList from './SocialIconList';
import AddFriendModal from '../Modal/AddFriendModal';
import useModalState from '../../store/Modal/useModalState';
import UserDetailModal from '../Modal/UserDetailModal';
import useRequest from '../../http/useRequest';
import { SERVER_URL } from '../../App';

export type Status = 'offline' | 'online' | 'in-game';
export type Relation = 'unknown' | 'friend' | 'block';
export type User = {
  nickname: string;
  image: string;
  status: Status;
  relation: Relation;
};

const Social = () => {
  const [selectedOption, setSelectedOption] = useState<string>('friend');
  const [users, setUsers] = useState<User[]>([]);
  const { request } = useRequest();

  const showUserDetail = useModalState('showUserDetail');
  const showAddFriend = useModalState('showAddFriend');

  const [activatedUserID, setActivatedUserID] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    const ret = await request<User[]>(`${SERVER_URL}/api/social`, {
      method: 'GET',
    });

    setUsers(ret || []);
  }, [request]);

  const refreshUsersHandler = () => {
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const changeOptionHandler = (option: string) => {
    setSelectedOption(option);
  };

  const setActivatedUserIDHandler = (userID: string) => {
    setActivatedUserID(userID);
  };

  return (
    <div className={styles.container}>
      <SocialSidebar
        selectedOption={selectedOption}
        onChangeOption={changeOptionHandler}
      />
      <SocialList
        filteredUsers={users.filter((user) => user.relation === selectedOption)}
        onActive={setActivatedUserIDHandler}
      />
      <SocialIconList onRefreshHandler={refreshUsersHandler} />
      {showAddFriend && <AddFriendModal />}
      {showUserDetail && (
        <UserDetailModal targetUserID={activatedUserID as string} />
      )}
    </div>
  );
};
export default Social;
