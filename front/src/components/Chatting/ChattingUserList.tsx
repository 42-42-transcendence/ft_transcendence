import { ChatUser } from '.';
import styles from '../../styles/Chatting.module.css';
import ChattingUserItem from './ChattingUserItem';

type Props = {
  users: ChatUser[];
  onActive: (user: ChatUser) => void;
};

const ChattingUserList = ({ users, onActive }: Props) => {
  const userItemList = users.map((user) => (
    <ChattingUserItem
      key={user.id}
      id={user.id}
      image={user.image}
      role={user.role}
      isMuted={user.isMuted}
      onActive={onActive}
      relation={user.relation}
      status={user.status}
    />
  ));
  return <ul className={styles.users}>{userItemList}</ul>;
};
export default ChattingUserList;
