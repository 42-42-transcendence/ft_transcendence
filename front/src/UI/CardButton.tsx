import styles from '../styles/CardButton.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
  clickHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const CardButton = ({ children, className, clickHandler, disabled, type }: Props) => {
  const classes = `${styles.card} ${className || ''}`;

  return (
    <button
      className={classes}
      onClick={clickHandler}
      disabled={disabled || false}
      type={type || 'button'}
    >
      {children}
    </button>
  );
};
export default CardButton;
