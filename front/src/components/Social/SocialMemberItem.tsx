import UserItem from '../../UI/UserItem';

import styles from '../../styles/Social.module.css';
import useOpenModal from '../../store/Modal/useOpenModal';
import { Member } from '.';

type Props = Member & {
  onActive: (member: Member) => void;
};

const SocialMemberItem = ({
  id,
  image,
  status,
  isBlocked,
  onActive,
}: Props) => {
  const openModalHandler = useOpenModal('showSocialMemberDetail');

  const activeHandler = () => {
    openModalHandler();
    onActive({ id, image, status, isBlocked });
  };

  return (
    <li>
      <UserItem
        id={id}
        image={image}
        className={`${styles.item} ${styles[status]}`}
        clickHandler={activeHandler}
      >
        <div className={`${styles.status} ${styles[status]}`}>{status}</div>
      </UserItem>
    </li>
  );
};
export default SocialMemberItem;
