import RecodeItem from './RecodeItem';
import styles from '../../styles/Dashboard.module.css';
import type { Recode } from '.';

type Props = {
  filteredRecodes: Recode[];
};

const RecodeList = ({ filteredRecodes }: Props) => {
  if (filteredRecodes.length === 0)
    return (
      <ul className={styles.items}>
        <h1>No history.</h1>
      </ul>
    );

  const recodeItemList = filteredRecodes.map((recode) => (
    <RecodeItem key={recode.id} recode={recode} />
  ));

  return <ul className={styles.items}>{recodeItemList}</ul>;
};
export default RecodeList;
