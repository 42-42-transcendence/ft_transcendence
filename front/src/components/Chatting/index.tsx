import ChattingContents from './ChattingContents';
import ChattingMemberList from './ChattingMemberList';

import styles from '../../styles/Chatting.module.css';
import ChattingSettingList from './ChattingSettingList';
import useModalState from '../Modal/useModalState';
import ChatExitConfirmModal from '../Modal/ChatExitConfirmModal';
import ChatInvitationModal from '../Modal/ChatInvitationModal';
import ChatRoomConfigModal from '../Modal/ChatRoomConfigModal';
import { useParams } from 'react-router-dom';

type Member = {
  id: string;
  image: string;
  role: 'owner' | 'staff' | 'member';
  isMuted: boolean;
};

type Content = {
  key: number;
  id: string;
  message: string;
  date: Date;
  type: 'normal' | 'system';
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
        'https://images.unsplash.com/photo-1682685797365-41f45b562c0a?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8',
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
    {
      key: 1,
      id: '이지수',
      message: '안녕하세요~!',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 123,
      id: '이지수',
      message: '님이 나갔습니다.',
      date: new Date(),
      type: 'system',
    },
    {
      key: 345345345,
      id: '이지수',
      message: '안녕하세요~!',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 1211113,
      id: '이지수',
      message: '님이 들어왔습니다.',
      date: new Date(),
      type: 'system',
    },
    {
      key: 2,
      id: '김말봉',
      message: 'helzzxzzxclo world',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 3,
      id: '존재하지않는 사용자 명이라면?',
      message: '12asdf3123',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 4,
      id: 'cccc',
      message: 'ㅁ나엄나어마너암넝',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 5,
      id: '이지수',
      message: '232333~!',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 6,
      id: 'asdfsdf',
      message: 'hello world',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 11123,
      id: '이지수',
      message: '님이 들어왔습니다.',
      date: new Date(),
      type: 'system',
    },
    {
      key: 7,
      id: '홍길동',
      message: '안녕하nvbncbncbn세요ㅎㅎ',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 8,
      id: 'aaaa',
      message: 'ㅁadsf나엄asdfasdfasdfadf나어마너암넝',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 9,
      id: '이지수',
      message: '안녕asdfsdf하세요~!',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 11,
      id: '김말봉',
      message: 'heasdfllo world',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 12,
      id: '홍길동',
      message: '안녕하asdf세요ㅎㅎ',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 13,
      id: 'cccc',
      message: 'ㅁ나엄나어마너암넝',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 14,
      id: '이지수',
      message: '안녕하세요~!',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 15,
      id: 'aaaa',
      message: 'heasdfllo world',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 16,
      id: '홍길동',
      message: '안녕하asdf세요ㅎㅎ',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 17,
      id: 'bbbb',
      message: 'ㅁ나엄asdf나어마너암넝',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 1243,
      id: '이지수',
      message: '님이 들어왔습니다.',
      date: new Date(),
      type: 'system',
    },
    {
      key: 18,
      id: '이지수',
      message: '안녕하세asdf요~!',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 121231233,
      id: '이지수',
      message: '님이 들어왔습니다.',
      date: new Date(),
      type: 'system',
    },
    {
      key: 19,
      id: 'asdfsdf',
      message: 'hello world',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 10,
      id: 'cccc',
      message: '안녕asdf하세asdf요ㅎㅎ',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 21,
      id: 'dddd',
      message: 'ㅁ나asdf엄asdf나어마너암넝',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 22,
      id: '이지수',
      message: '안녕하asdf세요~!',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 23,
      id: 'eeee',
      message: 'helasdfasdflo world',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 24,
      id: '홍길동',
      message: '안녕fda하세asdf요ㅎㅎ',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 3123123,
      id: '이지수',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 351518,
      id: '이지수',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 38666,
      id: '이지수',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 31111111111118,
      id: '이지수',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 25,
      id: 'cccc',
      message: 'ㅁ나엄faasdfasdf나어마너암넝',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 55123,
      id: '이지수',
      message: '님이 들어왔습니다.',
      date: new Date(),
      type: 'system',
    },
    {
      key: 26,
      id: 'a',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 27,
      id: 'a',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 28,
      id: 'a',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 29,
      id: 'a',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 30,
      id: 'a',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 31,
      id: 'a',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 32,
      id: 'a',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 33,
      id: 'a',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 34,
      id: '존재하지 않는 유저',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 35,
      id: 'a',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 36,
      id: '이지수',
      message: 'sdncvndff?????????<h1>asdf</h1>',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 37,
      id: 'cccc',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 38,
      id: '이지수',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
    {
      key: 663,
      id: '이지수',
      message: '님이 들어왔습니다.',
      date: new Date(),
      type: 'system',
    },
    {
      key: 66312,
      id: '이지수',
      message: '님이 나갔습니다.',
      date: new Date(),
      type: 'system',
    },
    {
      key: 39,
      id: '존재하지 않는 유저',
      message:
        'sdncvncvbaskdj fklasjdfkl jasdkfj klaj dfkl jasdkfjaskdfj askdjf asj fdlksjadff',
      date: new Date(),
      type: 'normal',
    },
  ],
};

const Chatting = () => {
  const params = useParams();
  const mode = params.mode;
  console.log(mode);

  const showChatRoomConfig = useModalState('showChatRoomConfig');
  const showChatInvitation = useModalState('showChatInvitation');
  const showChatExitConfirm = useModalState('showChatExitConfirm');

  return (
    <div className={styles.container}>
      <ChattingContents
        members={DUMMY_ITEMS.members}
        contents={DUMMY_ITEMS.contents}
      />
      <ChattingMemberList members={DUMMY_ITEMS.members} />
      {mode !== 'direct' && <ChattingSettingList />}
      {showChatRoomConfig && <ChatRoomConfigModal />}
      {showChatInvitation && <ChatInvitationModal />}
      {showChatExitConfirm && <ChatExitConfirmModal />}
    </div>
  );
};
export default Chatting;
