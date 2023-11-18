import styles from '../../styles/Channel.module.css';
import ChannelItem from './ChannelItem';
import type { ChannelType } from '.';

type Props = {
  filteredChannels: ChannelType[];
  isLoading: boolean;
  error: string;
};

const ChannelList = ({ filteredChannels, isLoading, error }: Props) => {
  const channelItemList = filteredChannels.map((channel) => (
    <ChannelItem
      key={channel.channelID}
      channelID={channel.channelID}
      title={channel.title}
      type={channel.type}
      total={channel.total}
      password={channel.password}
    />
  ));

  let contents: React.ReactNode = channelItemList;

  if (error) contents = <h1>{error}</h1>;
  else if (isLoading) contents = <h1>...Loading...</h1>;
  else if (channelItemList.length === 0)
    contents = <h1>No Chatting Channels.</h1>;

  return <ul className={styles.items}>{contents}</ul>;
};
export default ChannelList;
