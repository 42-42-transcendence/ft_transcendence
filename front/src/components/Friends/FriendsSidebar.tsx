import CardButton from '../../UI/CardButton';
import ToggleRadioButton from '../../UI/ToggleRadioButton';
import styles from '../../styles/Friends.module.css';

type Props = {
  selectedOption: string;
  onChangeOption: (option: string) => void;
};

const filterOptionList = ['friends', 'block'];

const FriendsSidebar = ({ selectedOption, onChangeOption }: Props) => {
  const optionRadioList = filterOptionList.map((option, index) => (
    <ToggleRadioButton
      key={option}
      name={option}
      id={option}
      value={option}
      title={option.toLocaleUpperCase()}
      isChecked={option === selectedOption}
      defaultChecked={index === 0}
      onActive={onChangeOption}
    />
  ));

  const addFriendsHandler = (e: React.MouseEvent<HTMLButtonElement>) => {};
  const addChannelButton = (
    <CardButton className={styles.add} clickHandler={addFriendsHandler}>
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
export default FriendsSidebar;
