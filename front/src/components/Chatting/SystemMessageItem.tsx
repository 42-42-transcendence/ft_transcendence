import styles from '../../styles/Chatting.module.css';

type Props = {
  message: string;
};

const SystemMessageItem = ({ message }: Props) => {
  return <div className={styles.system}>{message}</div>;
};
export default SystemMessageItem;
