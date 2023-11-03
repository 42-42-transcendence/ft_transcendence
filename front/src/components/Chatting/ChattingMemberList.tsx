import styles from '../../styles/Chatting.module.css';
import MemberItem from './MemberItem';

type User = {
  id: string;
  image: string;
  role: 'owner' | 'staff' | 'member';
  isMuted: boolean;
};

type Props = {
  members: User[];
};

const ChattingMembers = ({ members }: Props) => {
  const memberItemList = members.map((member) => (
    <MemberItem
      key={member.id}
      id={member.id}
      image={member.image}
      role={member.role}
      isMuted={member.isMuted}
    />
  ));
  return <ul className={styles.members}>{memberItemList}</ul>;
};
export default ChattingMembers;
