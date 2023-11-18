import { useCallback, useEffect, useState } from 'react';
import ChannelSidebar from './ChannelSidebar';
import ChannelList from './ChannelList';

import styles from '../../styles/Channel.module.css';
import useModalState from '../../store/Modal/useModalState';
import CreatingChatRoomModal from '../Modal/CreatingChatRoomModal';
import ChannelIconList from './ChannelIconList';
import useRequest from '../../http/useRequest';
import { SERVER_URL } from '../../App';

type ChannelType = {
  channelID: string;
  title: string;
  type: 'public' | 'private' | 'direct';
  total?: number;
  password?: string;
};

const Channel = () => {
  const { isLoading, error, request } = useRequest();

  const showCreatingChatRoom = useModalState('showCreatingChatRoom');

  const [selectedFilter, setSelectedFilter] = useState<string>('public');
  const [channels, setChannels] = useState<ChannelType[]>([]);

  const changeFilterHandler = (filter: string) => {
    setSelectedFilter(filter);
  };

  const setRequestData = useCallback(async () => {
    const channels = await request<ChannelType[]>(`${SERVER_URL}/api/channel`, {
      method: 'GET',
    });

    if (channels !== null) {
      setChannels(channels.reverse());
    }
  }, [request]);

  const refreshChannelHandler = () => {
    setRequestData();
  };

  useEffect(() => {
    setRequestData();
  }, [setRequestData]);

  return (
    <>
      <div className={styles.container}>
        <ChannelSidebar
          selectedFilter={selectedFilter}
          onChangeFilter={changeFilterHandler}
        />
        <ChannelList
          filteredChannels={channels.filter(
            (channel) => channel.type === selectedFilter
          )}
          isLoading={isLoading}
          error={error}
        />
        <ChannelIconList onRefreshHandler={refreshChannelHandler} />
      </div>
      {showCreatingChatRoom && <CreatingChatRoomModal />}
    </>
  );
};

export type { ChannelType };
export default Channel;
