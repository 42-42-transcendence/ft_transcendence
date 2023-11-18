import type { Member } from '.';
import styles from '../../styles/Chatting.module.css';
import ChattingMemberItem from './ChattingMemberItem';

type Props = {
  members: Member[];
  onActive: (member: Member) => void;
};

const ChattingMemberList = ({ members, onActive }: Props) => {
  const memberItemList = members.map((member) => (
    <ChattingMemberItem
      key={member.id}
      id={member.id}
      image={member.image}
      role={member.role}
      isMuted={member.isMuted}
      onActive={onActive}
    />
  ));
  return <ul className={styles.members}>{memberItemList}</ul>;
};
export default ChattingMemberList;
