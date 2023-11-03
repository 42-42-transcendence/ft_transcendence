import styles from '../../styles/Chatting.module.css';

type Content = {
  id: string;
  message: string;
  date: Date;
};

type Props = {
  contents: Content[];
};
const ChattingContents = ({ contents }: Props) => {
  return <div className={styles.contents}>contents</div>;
};
export default ChattingContents;
