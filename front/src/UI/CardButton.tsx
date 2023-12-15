import styles from '../styles/CardButton.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
  clickHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

const CardButton = ({ children, className, clickHandler, disabled }: Props) => {
  const classes = `${styles.card} ${className || ''}`;

  return (
    <button
      className={classes}
      onClick={clickHandler}
      disabled={disabled || false}
    >
      {children}
    </button>
  );
};
export default CardButton;
