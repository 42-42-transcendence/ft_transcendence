import { useState } from 'react';

import styles from '../../styles/Social.module.css';
import SocialList from './SocialList';
import SocialSidebar from './SocialSidebar';
import SocialIconList from './SocialIconList';
import AddFriendModal from '../Modal/AddFriendModal';
import SocialMemberDetailModal from '../Modal/SocialMemberDetailModal';
import useModalState from '../../store/Modal/useModalState';

export type Member = {
  id: string;
  image: string;
  status: 'offline' | 'online' | 'in-game';
  isBlocked: boolean;
};

const Social = () => {
  const [selectedOption, setSelectedOption] = useState<string>('friends');

  const showSocialMemberDetail = useModalState('showSocialMemberDetail');
  const showAddFriend = useModalState('showAddFriend');

  const [activeMember, setActiveMember] = useState<Member>({
    id: '',
    image: '',
    status: 'offline',
    isBlocked: false,
  });

  const changeOptionHandler = (option: string) => {
    setSelectedOption(option);
  };

  const setActiveUserHandler = (member: Member) => {
    setActiveMember({ ...member });
  };

  return (
    <div className={styles.container}>
      <SocialSidebar
        selectedOption={selectedOption}
        onChangeOption={changeOptionHandler}
      />
      <SocialList
        selectedOption={selectedOption}
        onActive={setActiveUserHandler}
      />
      <SocialIconList />
      {showAddFriend && <AddFriendModal />}
      {showSocialMemberDetail && (
        <SocialMemberDetailModal member={activeMember as Member} />
      )}
    </div>
  );
};
export default Social;
