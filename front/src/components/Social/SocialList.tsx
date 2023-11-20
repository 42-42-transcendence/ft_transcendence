import { User } from '.';
import styles from '../../styles/Social.module.css';
import SocialUserItem from './SocialUserItem';

const DUMMY_ITEMS: User[] = [
  {
    id: '이지수',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    relation: 'friend',
  },
  {
    id: '김말봉',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'offline',
    relation: 'friend',
  },
  {
    id: '홍길동',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'offline',
    relation: 'block',
  },
  {
    id: 'abcd',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    relation: 'friend',
  },
  {
    id: 'asdf',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    relation: 'friend',
  },
  {
    id: 'qweqwe',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    relation: 'block',
  },
  {
    id: 'xcbxcvb',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'in-game',
    relation: 'friend',
  },
  {
    id: 'ccczzz',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'in-game',
    relation: 'block',
  },
  {
    id: 'fjgakdjf',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    relation: 'block',
  },
  {
    id: 'cfjgkdjf',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    relation: 'friend',
  },
  {
    id: 'eeee',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    relation: 'friend',
  },
  {
    id: 'hhhh',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'in-game',
    relation: 'friend',
  },
  {
    id: 'iiii',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'offline',
    relation: 'friend',
  },
  {
    id: 'qqqqqq',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    relation: 'friend',
  },
];

const sortByStatus = (a: User, b: User): number => {
  const aPriority = a.status === 'offline' ? 1 : 0;
  const bPriority = b.status === 'offline' ? 1 : 0;
  return aPriority - bPriority;
};

type Props = {
  selectedOption: string;
  onActive: (userID: string) => void;
};

const SocialUserList = ({ selectedOption, onActive }: Props) => {
  let filteredSocialUserList: User[] = [];
  if (selectedOption === 'friends')
    filteredSocialUserList = DUMMY_ITEMS.filter(
      (user) => user.relation === 'friend'
    );
  else
    filteredSocialUserList = DUMMY_ITEMS.filter(
      (user) => user.relation === 'block'
    );

  filteredSocialUserList.sort(sortByStatus);

  const socialUserItemList = filteredSocialUserList.map((user) => (
    <SocialUserItem
      key={user.id}
      id={user.id}
      image={user.image}
      status={user.status}
      relation={user.relation}
      onActive={onActive}
    />
  ));

  return <ul className={styles.items}>{socialUserItemList}</ul>;
};
export default SocialUserList;
