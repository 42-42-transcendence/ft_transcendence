import styles from '../styles/CardButton.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
  clickHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const CardButton = ({ children, className, clickHandler }: Props) => {
  const classes = `${styles.card} ${className || ''}`;
  return (
    <button className={classes} onClick={clickHandler}>
      {children}
    </button>
  );
};
export default CardButton;
