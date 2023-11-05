import AvatarImage from './AvatarImage';
import CardButton from './CardButton';

import styles from '../styles/UserItem.module.css';

type Props = {
  id: string;
  image: string;
  className?: string;
  children?: React.ReactNode;
};

const UserItem = ({ id, image, className, children }: Props) => {
  return (
    <CardButton className={`${styles.item} ${className || ''}`}>
      <AvatarImage imageURI={image} radius="30%" />
      <div className={styles.info}>
        <div className={styles.name}>{id}</div>
        {children}
      </div>
    </CardButton>
  );
};
export default UserItem;
