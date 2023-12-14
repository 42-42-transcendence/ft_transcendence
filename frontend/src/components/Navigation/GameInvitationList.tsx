import styles from '../../styles/Navigation.module.css';
import useNotificationState from '../../store/Notification/useNotificationState';
import GameInvitationItem from './GameInvitationItem';

const GameInvitationList = () => {
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
    <ul className={styles['game-invitation-list']}>{gameInvitationItemList}</ul>
  );
};
export default GameInvitationList;
