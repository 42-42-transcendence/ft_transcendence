import CardButton from '../../UI/CardButton';
import ToggleRadioButton from '../../UI/ToggleRadioButton';

import useOpenModal from '../Modal/useOpenModal';

import styles from '../../styles/Channel.module.css';

type Props = {
  selectedOption: string;
  onChangeOption: (option: string) => void;
};

const filterOptionList = ['public', 'private', 'direct'];

const ChannelSidebar = ({ selectedOption, onChangeOption }: Props) => {
  const openHandler = useOpenModal('showCreatingChatRoom');

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

  const addChannelButton = (
    <CardButton className={styles.add} clickHandler={openHandler}>
      + ADD
    </CardButton>
  );

  return (
    <ul className={styles.sidebar}>
      <div>{optionRadioList}</div>
      <div>{addChannelButton}</div>
    </ul>
  );
};
export default ChannelSidebar;
