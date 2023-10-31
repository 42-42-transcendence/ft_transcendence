import styles from '../styles/ToggleRadioButton.module.css';

type Props = {
  id: string;
  name: string;
  value: string;
  title: string;
  isChecked: boolean;
  defaultChecked: boolean;
  onActive: (id: string) => void;
};

const ToggleRadioButton = ({
  name,
  id,
  value,
  title,
  isChecked,
  defaultChecked,
  onActive,
}: Props) => {
  const clickHandler = (e: React.MouseEvent<HTMLLabelElement>) => {
    onActive(e.currentTarget.htmlFor);
  };

  return (
    <div className={styles.wrapper}>
      <label
        htmlFor={id}
        onClick={clickHandler}
        className={`${styles.label} ${isChecked ? styles.checked : ''}`}
      >
        {title}
      </label>
      <input
        type="radio"
        name={name}
        id={id}
        value={value}
        defaultChecked={defaultChecked}
      />
    </div>
  );
};
export default ToggleRadioButton;
