import RecodeItem from './RecodeItem';
import styles from '../../styles/Dashboard.module.css';
import loadingImage from '../../assets/loading.gif';
import type { Recode } from '.';

type Props = {
  filteredRecodes: Recode[];
  isLoading: boolean;
  error: string;
};

const RecodeList = ({ filteredRecodes, isLoading, error }: Props) => {
  const recodeItemList = filteredRecodes.map((recode) => (
    <RecodeItem key={recode.id} recode={recode} />
  ));

  let contents: React.ReactNode = recodeItemList;
  if (error) contents = <h1>{error}</h1>;
  else if (isLoading) contents = <img src={loadingImage} alt="loading" />;
  else if (recodeItemList.length === 0)
    contents = <h1>No Chatting Channels.</h1>;

  return <ul className={styles.items}>{contents}</ul>;
};
export default RecodeList;
