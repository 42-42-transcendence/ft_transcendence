import styles from '../../styles/Navigation.module.css';
import useNotificationState from '../../store/Notification/useNotificationState';
import GameInvitationItem from './GameInvitationItem';
import { Notification } from '../../store/Notification/notification';
import useModalState from '../../store/Modal/useModalState';
import MessageModal from '../Modal/MessageModal';
import { useState } from 'react';

// const gameInvitations: Notification[] = [
//   {
//     notiID: '1',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '2',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '3',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '4',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '44',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '41',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '412',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '43',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '4a',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '4c',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '4d',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '4h',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '4q',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '4e',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '4w',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '4r',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '4t',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '4y',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
//   {
//     notiID: '4u',
//     notiType: 'game',
//     message: 'asdf님의 게임 초대 요청',
//     data: 'asdf',
//   },
// ];

const GameInvitationList = () => {
  const showMessage = useModalState('showMessage');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const notificationState = useNotificationState();
  const gameInvitations = notificationState.notifications.filter(
    (notification) => notification.notiType === 'game'
  );

  const gameInvitationItemList = gameInvitations.map((invitation) => (
    <GameInvitationItem
      key={invitation.notiID}
      id={invitation.notiID}
      message={invitation.message}
      inviterNickname={invitation.data as string}
    />
  ));

  return (
    <>
      <ul className={styles['game-invitation-list']}>
        {gameInvitationItemList}
      </ul>
      {showMessage && (
        <MessageModal title="매칭 취소" message={feedbackMessage} />
      )}
    </>
  );
};
export default GameInvitationList;
