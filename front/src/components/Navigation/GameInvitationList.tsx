import styles from '../../styles/Navigation.module.css';
import useNotificationState from '../../store/Notification/useNotificationState';
import GameInvitationItem from './GameInvitationItem';
import useModalState from '../../store/Modal/useModalState';
import MessageModal from '../Modal/MessageModal';
import { useState } from 'react';

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
      setMessage={setFeedbackMessage}
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
