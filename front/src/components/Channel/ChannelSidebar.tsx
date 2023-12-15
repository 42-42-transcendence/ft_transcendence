import ToggleRadioButton from '../../UI/ToggleRadioButton';
import styles from '../../styles/Channel.module.css';

type Props = {
  selectedFilter: string;
  onChangeFilter: (option: string) => void;
};

const filterOptionList = ['public', 'private', 'dm'];

const ChannelSidebar = ({ selectedFilter, onChangeFilter }: Props) => {
  const optionRadioList = filterOptionList.map((option, index) => (
    <ToggleRadioButton
      key={option}
      name="option"
      id={option}
      value={option}
      title={option.toLocaleUpperCase()}
      isChecked={option === selectedFilter}
      defaultChecked={index === 0}
      onActive={onChangeFilter}
    />
  ));

  return <ul className={styles.sidebar}>{optionRadioList}</ul>;
};
export default ChannelSidebar;
