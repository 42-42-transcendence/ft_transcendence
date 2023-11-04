import styles from '../../styles/Chatting.module.css';
import ChattingForm from './ChattingForm';
import ChattingMessageList from './ChattingMessageList';
import ChattingSettingsButton from './ChattingSettingsButton';

type Content = {
  key: number;
  id: string;
  message: string;
  date: Date;
  type: 'normal' | 'system';
};

type Member = {
  id: string;
  image: string;
  role: 'owner' | 'staff' | 'member';
  isMuted: boolean;
};

type Props = {
  members: Member[];
  contents: Content[];
};

const ChattingContents = ({ members, contents }: Props) => {
  return (
    <div className={styles.contents}>
      <ChattingMessageList members={members} contents={contents} />
      <ChattingForm />
      <ChattingSettingsButton />
    </div>
  );
};
export default ChattingContents;
