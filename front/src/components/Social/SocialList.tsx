import type { Member } from '.';
import styles from '../../styles/Social.module.css';
import SocialMemberItem from './SocialMemberItem';

const DUMMY_ITEMS: Member[] = [
  {
    id: '이지수',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    isBlocked: false,
  },
  {
    id: '김말봉',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'offline',
    isBlocked: false,
  },
  {
    id: '홍길동',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'offline',
    isBlocked: true,
  },
  {
    id: 'abcd',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    isBlocked: false,
  },
  {
    id: 'asdf',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    isBlocked: false,
  },
  {
    id: 'qweqwe',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    isBlocked: true,
  },
  {
    id: 'xcbxcvb',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'in-game',
    isBlocked: false,
  },
  {
    id: 'ccczzz',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'in-game',
    isBlocked: false,
  },
  {
    id: 'fjgakdjf',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    isBlocked: false,
  },
  {
    id: 'cfjgkdjf',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    isBlocked: false,
  },
  {
    id: 'eeee',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    isBlocked: false,
  },
  {
    id: 'hhhh',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'in-game',
    isBlocked: false,
  },
  {
    id: 'iiii',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'offline',
    isBlocked: false,
  },
  {
    id: 'qqqqqq',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    status: 'online',
    isBlocked: false,
  },
];

const sortByStatus = (a: Member, b: Member): number => {
  const aPriority = a.status === 'offline' ? 1 : 0;
  const bPriority = b.status === 'offline' ? 1 : 0;
  return aPriority - bPriority;
};

type Props = {
  selectedOption: string;
  onActive: (member: Member) => void;
};

const SocialMemberList = ({ selectedOption, onActive }: Props) => {
  let filteredSocialMemberList: Member[] = [];
  if (selectedOption === 'friends')
    filteredSocialMemberList = DUMMY_ITEMS.filter(
      (member) => !member.isBlocked
    );
  else
    filteredSocialMemberList = DUMMY_ITEMS.filter((member) => member.isBlocked);

  filteredSocialMemberList.sort(sortByStatus);

  const socialMemberItemList = filteredSocialMemberList.map((member) => (
    <SocialMemberItem
      key={member.id}
      id={member.id}
      image={member.image}
      status={member.status}
      isBlocked={member.isBlocked}
      onActive={onActive}
    />
  ));

  return <ul className={styles.items}>{socialMemberItemList}</ul>;
};
export default SocialMemberList;
