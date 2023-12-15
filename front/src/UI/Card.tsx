import styles from '../styles/Card.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className }: Props) => {
  const classes = `${styles.card} ${className || ''}`;
  return <div className={classes}>{children}</div>;
};

export default Card;
