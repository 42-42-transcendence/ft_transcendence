import ChattingContents from './ChattingContents';
import ChattingMemberList from './ChattingMemberList';

import styles from '../../styles/Chatting.module.css';

type Member = {
  id: string;
  image: string;
  role: 'owner' | 'staff' | 'member';
  isMuted: boolean;
};

type Content = {
  id: string;
  message: string;
  date: Date;
};

type DUMMY_TYPE = {
  members: Member[];
  contents: Content[];
};

const DUMMY_ITEMS: DUMMY_TYPE = {
  members: [
    {
      id: '이지수',
      image:
        'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
      role: 'owner',
      isMuted: false,
    },
    {
      id: 'asdfsdf',
      image:
        'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
      role: 'staff',
      isMuted: false,
    },
    {
      id: '홍길동',
      image:
        'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
      role: 'staff',
      isMuted: true,
    },
    {
      id: 'cccc',
      image:
        'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
      role: 'staff',
      isMuted: false,
    },
    {
      id: 'a',
      image:
        'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
      role: 'member',
      isMuted: false,
    },
    {
      id: 'bbbbb',
      image:
        'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
      role: 'member',
      isMuted: false,
    },
    {
      id: 'cccccc',
      image:
        'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
      role: 'member',
      isMuted: false,
    },
    {
      id: 'dddddd',
      image:
        'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
      role: 'member',
      isMuted: false,
    },
    {
      id: 'eeeeee',
      image:
        'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
      role: 'member',
      isMuted: false,
    },
  ],
  contents: [
    { id: '이지수', message: '안녕하세요~!', date: new Date() },
    { id: 'asdfsdf', message: 'helzzxzzxclo world', date: new Date() },
    { id: '홍길동', message: '12asdf3123', date: new Date() },
    { id: 'cccc', message: 'ㅁ나엄나어마너암넝', date: new Date() },
    { id: '이지수', message: '232333~!', date: new Date() },
    { id: 'asdfsdf', message: 'hello world', date: new Date() },
    { id: '홍길동', message: '안녕하nvbncbncbn세요ㅎㅎ', date: new Date() },
    {
      id: 'cccc',
      message: 'ㅁadsf나엄asdfasdfasdfadf나어마너암넝',
      date: new Date(),
    },
    { id: '이지수', message: '안녕asdfsdf하세요~!', date: new Date() },
    { id: 'asdfsdf', message: 'heasdfllo world', date: new Date() },
    { id: '홍길동', message: '안녕하asdf세요ㅎㅎ', date: new Date() },
    { id: 'cccc', message: 'ㅁ나엄나어마너암넝', date: new Date() },
    { id: '이지수', message: '안녕하세요~!', date: new Date() },
    { id: 'asdfsdf', message: 'heasdfllo world', date: new Date() },
    { id: '홍길동', message: '안녕하asdf세요ㅎㅎ', date: new Date() },
    { id: 'cccc', message: 'ㅁ나엄asdf나어마너암넝', date: new Date() },
    { id: '이지수', message: '안녕하세asdf요~!', date: new Date() },
    { id: 'asdfsdf', message: 'hello world', date: new Date() },
    { id: '홍길동', message: '안녕asdf하세asdf요ㅎㅎ', date: new Date() },
    { id: 'cccc', message: 'ㅁ나asdf엄asdf나어마너암넝', date: new Date() },
    { id: '이지수', message: '안녕하asdf세요~!', date: new Date() },
    { id: 'asdfsdf', message: 'helasdfasdflo world', date: new Date() },
    { id: '홍길동', message: '안녕fda하세asdf요ㅎㅎ', date: new Date() },
    { id: 'cccc', message: 'ㅁ나엄faasdfasdf나어마너암넝', date: new Date() },
    {
      id: 'a',
      message:
        'sdncvncvbaskdjfklasjdfkljasdkfj klajdfkl jasdkfjaskdfj askdjf asjfdlksjadff',
      date: new Date(),
    },
  ],
};

const Chatting = () => {
  return (
    <div className={styles.container}>
      <ChattingContents contents={DUMMY_ITEMS.contents} />
      <ChattingMemberList members={DUMMY_ITEMS.members} />
    </div>
  );
};
export default Chatting;
