import { useCallback, useEffect, useState } from 'react';
import ChannelSidebar from './ChannelSidebar';
import ChannelList from './ChannelList';

import styles from '../../styles/Channel.module.css';
import useModalState from '../../store/Modal/useModalState';
import CreatingChatRoomModal from '../Modal/CreatingChatRoomModal';
import ChannelIconList from './ChannelIconList';
import useRequest from '../../http/useRequest';

type ChannelType = {
  id: string;
  title: string;
  type: 'public' | 'private' | 'direct';
  total?: number;
  password?: string;
};

const url = 'http://localhost:3001/api/channel';
const options = {
  method: 'GET',
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
    const channels = await request<ChannelType[]>(url, options);

    setChannels(channels?.reverse() || []);
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
      {showCreatingChatRoom && (
        <CreatingChatRoomModal onRefreshChannel={refreshChannelHandler} />
      )}
    </>
  );
};

export type { ChannelType };
export default Channel;
