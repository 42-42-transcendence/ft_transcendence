import { Link } from 'react-router-dom';
import styles from '../styles/BackLink.module.css';

type Props = {
  title: string;
  redirect: string;
  className?: string;
};

const BackLink = ({ title, redirect, className }: Props) => {
  const classes = `${styles.link} ${className || ''}`;
  return (
    <Link className={classes} to={redirect}>
      {title}
    </Link>
  );
};
export default BackLink;
