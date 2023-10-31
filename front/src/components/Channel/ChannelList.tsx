import styles from '../../styles/Channel.module.css';
import ChannelItem from './ChannelItem';

type DUMMY_TYPE = {
  id: number;
  title: string;
  mode: 'public' | 'private' | 'direct';
  total?: number;
  password?: boolean;
};
const DUMMY_ITEMS: DUMMY_TYPE[] = [
  { id: 1, title: '공개 채팅방 1', mode: 'public', total: 5 },
  { id: 37, title: 'DM 7', mode: 'direct' },
  { id: 9, title: '공개 채팅방 9', mode: 'public', total: 5 },
  { id: 10, title: '공개 채팅방 10', mode: 'public', total: 5 },
  { id: 16, title: '보호 채팅방 6', mode: 'public', total: 5, password: true },
  { id: 35, title: 'DM 5', mode: 'direct' },
  { id: 36, title: 'DM 6', mode: 'direct' },
  { id: 15, title: '보호 채팅방 5', mode: 'public', total: 5, password: true },
  { id: 38, title: 'DM 8', mode: 'direct' },
  { id: 12, title: '보호 채팅방 2', mode: 'public', total: 5, password: true },
  { id: 2, title: '공개 채팅방 2', mode: 'public', total: 5 },
  { id: 14, title: '보호 채팅방 4', mode: 'public', total: 5, password: true },
  { id: 21, title: '비밀 채팅방 1', mode: 'private', total: 5 },
  { id: 22, title: '비밀 채팅방 2', mode: 'private', total: 5 },
  { id: 5, title: '공개 채팅방 5', mode: 'public', total: 5 },
  { id: 7, title: '공개 채팅방 7', mode: 'public', total: 5 },
  { id: 18, title: '보호 채팅방 8', mode: 'public', total: 5, password: true },
  { id: 29, title: '비밀 채팅방 9', mode: 'private', total: 5 },
  { id: 8, title: '공개 채팅방 8', mode: 'public', total: 5 },
  { id: 20, title: '보호 채팅방 10', mode: 'public', total: 5, password: true },
  { id: 28, title: '비밀 채팅방 8', mode: 'private', total: 5 },
  { id: 11, title: '보호 채팅방 1', mode: 'public', total: 5, password: true },
  { id: 3, title: '공개 채팅방 3', mode: 'public', total: 5 },
  { id: 13, title: '보호 채팅방 3', mode: 'public', total: 5, password: true },
  { id: 19, title: '보호 채팅방 9', mode: 'public', total: 5, password: true },
  { id: 23, title: '비밀 채팅방 3', mode: 'private', total: 5 },
  { id: 24, title: '비밀 채팅방 4', mode: 'private', total: 5 },
  { id: 25, title: '비밀 채팅방 5', mode: 'private', total: 5 },
  { id: 4, title: '공개 채팅방 4', mode: 'public', total: 5 },
  { id: 30, title: '비밀 채팅방 10', mode: 'private', total: 5 },
  { id: 31, title: 'DM 1', mode: 'direct' },
  { id: 32, title: 'DM 2', mode: 'direct' },
  { id: 33, title: 'DM 3', mode: 'direct' },
  { id: 17, title: '보호 채팅방 7', mode: 'public', total: 5, password: true },
  { id: 6, title: '공개 채팅방 6', mode: 'public', total: 5 },
  { id: 26, title: '비밀 채팅방 6', mode: 'private', total: 5 },
  { id: 27, title: '비밀 채팅방 7', mode: 'private', total: 5 },
  { id: 34, title: 'DM 4', mode: 'direct' },
  { id: 39, title: 'DM 9', mode: 'direct' },
  { id: 40, title: 'DM 10', mode: 'direct' },
];

type Props = {
  selectedOption: string;
};

const ChannelList = ({ selectedOption }: Props) => {
  const channelItemList = DUMMY_ITEMS.filter(
    (item) => selectedOption === item.mode
  ).map((item) => (
    <ChannelItem
      key={item.id}
      id={item.id}
      title={item.title}
      mode={item.mode}
      total={item.total}
      password={item.password}
    />
  ));

  if (channelItemList.length === 0) return <h1>No Chatting Channel.</h1>;
  else return <ul className={styles.items}>{channelItemList}</ul>;
};
export default ChannelList;
