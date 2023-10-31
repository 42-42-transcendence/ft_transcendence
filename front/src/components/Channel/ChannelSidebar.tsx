import CardButton from '../../UI/CardButton';
import ToggleRadioButton from '../../UI/ToggleRadioButton';

import styles from '../../styles/Channel.module.css';

type Props = {
  selectedOption: string;
  onChangeOption: (option: string) => void;
};

const filterOptionList = ['public', 'private', 'direct'];
const titleList = ['공개 채팅', '비공개 채팅', 'DM'];

const ChannelSidebar = ({ selectedOption, onChangeOption }: Props) => {
  const optionRadioList = filterOptionList.map((option, index) => (
    <ToggleRadioButton
      key={option}
      name="option"
      id={option}
      value={option}
      title={titleList[index]}
      isChecked={option === selectedOption}
      defaultChecked={index === 0}
      onActive={onChangeOption}
    />
  ));

  const addChannelHandler = (e: React.MouseEvent<HTMLButtonElement>) => {};
  const addChannelButton = (
    <CardButton className={styles.add} clickHandler={addChannelHandler}>
      + 방 만들기
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
