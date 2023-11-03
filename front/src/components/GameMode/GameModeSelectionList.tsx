import { useState } from 'react';
import ToggleRadioButton from '../../UI/ToggleRadioButton';
import styles from '../../styles/GameSelectForm.module.css';

const modeList = ['normal', 'fast', 'object'];

const GameModeSelectionList = () => {
  const [enteredMode, setEnteredMode] = useState<string>('normal');

  const changeModeHandler = (mode: string) => {
    setEnteredMode(mode);
  };

  const modeRadioList = modeList.map((mode, index) => (
    <ToggleRadioButton
      key={mode}
      name="mode"
      id={mode}
      value={mode}
      title={mode.toUpperCase()}
      isChecked={enteredMode === mode}
      defaultChecked={index === 0}
      onActive={changeModeHandler}
    />
  ));

  return <ul className={styles.list}>{modeRadioList}</ul>;
};
export default GameModeSelectionList;
