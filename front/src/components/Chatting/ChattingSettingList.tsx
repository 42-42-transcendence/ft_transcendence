import settingsIcon from '../../assets/setting-icon.svg';
import addUserIcon from '../../assets/add-user-icon.svg';
import exitIcon from '../../assets/exit-icon.svg';

import styles from '../../styles/Chatting.module.css';
import useOpenModal from '../../store/Modal/useOpenModal';
import { Role } from '.';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SERVER_URL } from '../../App';
import useRequest from '../../http/useRequest';

type Props = {
  myRole: Role | null;
};

type ChannelType = 'public' | 'private' | 'dm';

const ChattingSettingList = ({ myRole }: Props) => {
  const params = useParams();
  const { request } = useRequest();
  const [channelType, setChannelType] = useState<ChannelType | null>(null);

  useEffect(() => {
    const fetchChannelType = async () => {
      const ret = await request<any>(
        `${SERVER_URL}/api/channel/${params.channelID}`,
        {
          method: 'GET',
        }
      );
      if (ret !== null) setChannelType(ret.type);
    };

    fetchChannelType();
  }, [request, params]);
  const openConfigModalHandler = useOpenModal('showChatRoomConfig');
  const openInvitationModalHandler = useOpenModal('showChatInvitation');
  const openExitModalHandler = useOpenModal('showConfirm');

  if (channelType === null || channelType === 'dm') {
    return <></>;
  }
  return (
    <ul className={styles['setting-icon-list']}>
      <li>
        <button
          className={styles['icon-button']}
          onClick={openInvitationModalHandler}
        >
          <img src={addUserIcon} alt="adduser icon" />
        </button>
      </li>
      <li>
        <button
          className={styles['icon-button']}
          onClick={openExitModalHandler}
        >
          <img src={exitIcon} alt="exit icon" />
        </button>
      </li>
      {myRole === 'owner' && (
        <li>
          <button
            className={styles['icon-button']}
            onClick={openConfigModalHandler}
          >
            <img src={settingsIcon} alt="setting icon" />
          </button>
        </li>
      )}
    </ul>
  );
};
export default ChattingSettingList;
