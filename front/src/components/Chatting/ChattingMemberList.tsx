import { ChatMember } from '.';
import styles from '../../styles/Chatting.module.css';
import ChattingMemberItem from './ChattingMemberItem';

type Props = {
  members: ChatMember[];
  onActive: (userID: string) => void;
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
      relation={member.relation}
    />
  ));
  return <ul className={styles.members}>{memberItemList}</ul>;
};
export default ChattingMemberList;
