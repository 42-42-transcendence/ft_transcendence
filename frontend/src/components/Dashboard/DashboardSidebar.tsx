import ToggleRadioButton from '../../UI/ToggleRadioButton';

import styles from '../../styles/Dashboard.module.css';

type Props = {
  selectedOption: string;
  onChangeOption: (option: string) => void;
};

const filterOptionList = ['all', 'ladder', 'friendly'];

const DashboardSidebar = ({ selectedOption, onChangeOption }: Props) => {
  const optionRadioList = filterOptionList.map((option, index) => (
    <ToggleRadioButton
      key={option}
      name="option"
      id={option}
      value={option}
      title={option.toLocaleUpperCase()}
      isChecked={option === selectedOption}
      defaultChecked={index === 0}
      onActive={onChangeOption}
    />
  ));

  return <ul className={styles.sidebar}>{optionRadioList}</ul>;
};
export default DashboardSidebar;
