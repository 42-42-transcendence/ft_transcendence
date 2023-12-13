import { ChatMember } from '.';
import styles from '../../styles/Chatting.module.css';
import ChattingMemberItem from './ChattingMemberItem';

type Props = {
  members: ChatMember[];
  onActive: (userID: string) => void;
};

const roleMap = {
  owner: 0,
  staff: 1,
  guest: 2,
};

const sortByRole = (a: ChatMember, b: ChatMember): number => {
  const aPriority = roleMap[a.role];
  const bPriority = roleMap[b.role];

  if (aPriority === bPriority) {
    return a.nickname.toLowerCase() < b.nickname.toLowerCase() ? -1 : 1;
  } else return aPriority - bPriority;
};

const ChattingMemberList = ({ members, onActive }: Props) => {
  members.sort(sortByRole);

  const memberItemList = members.map((member) => (
    <ChattingMemberItem
      key={member.nickname}
      nickname={member.nickname}
      image={member.image}
      role={member.role}
      isMuted={member.isMuted}
      onActive={onActive}
      relation={member.relation}
    />
  ));
  return <ul className={styles.members}>{memberItemList}</ul>;
};
export default ChattingMemberList;
