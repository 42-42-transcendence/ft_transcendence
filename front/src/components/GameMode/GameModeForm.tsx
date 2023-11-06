import { Form } from 'react-router-dom';

import styles from '../../styles/GameSelect.module.css';
import GameModeSelectionList from './GameModeSelectionList';
import CardButton from '../../UI/CardButton';
import GameMatchingModal from './GameMatchingModal';

import { useSelector, useDispatch } from 'react-redux';
import { actions as modalActions } from '../../store/modal';
import type { RootStoreType } from '../../store/index';
import GameInvitationModal from './GameInvitationModal';

const GameModeForm = () => {
  const dispatch = useDispatch();
  const showGameMatching = useSelector(
    (state: RootStoreType) => state.modal.showGameMatching
  );
  const showGameInvitation = useSelector(
    (state: RootStoreType) => state.modal.showGameInvitation
  );

  const openGameMatchingModalHandler = () => {
    dispatch(modalActions.openModal('showGameMatching'));
  };
  const closeGameMatchingModalHandler = () => {
    dispatch(modalActions.closeModal());
  };

  const openGameInvitationModal = () => {
    dispatch(modalActions.openModal('showGameInvitation'));
  };
  const closeGameInvitationModal = () => {
    dispatch(modalActions.closeModal());
  };

  return (
    <>
      <Form method="post" className={styles.form}>
        <div className={styles.container}>
          <h2>GAME MODE</h2>
          <GameModeSelectionList />
          <CardButton
            className={styles.start}
            clickHandler={openGameMatchingModalHandler}
          >
            START
          </CardButton>
        </div>
      </Form>
      {showGameMatching && (
        <GameMatchingModal onClose={closeGameMatchingModalHandler} />
      )}
    </>
  );
};

export default GameModeForm;
