import { useState } from 'react';
import ToggleRadioButton from '../../UI/ToggleRadioButton';
import styles from '../../styles/GameSelect.module.css';

const modeList = ['normal', 'AI', 'object'];

type GameModeSelectionListProps = {
  setEnteredMode: (mode: string) => void;
  enteredMode: string;
};

const GameModeSelectionList: React.FC<GameModeSelectionListProps> = ({ enteredMode, setEnteredMode}) => {
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
