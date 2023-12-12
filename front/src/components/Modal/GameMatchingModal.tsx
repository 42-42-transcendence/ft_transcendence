import Modal from '../../UI/Modal';

import styles from '../../styles/Modal.module.css';
import loadingImage from '../../assets/loading.gif';

import useCloseModal from '../../store/Modal/useCloseModal';
import useRequest from '../../http/useRequest';
import { SERVER_URL } from '../../App';
import { useEffect } from 'react';

type Props = {
  mode: string;
};

const GameMatchingModal = ({ mode }: Props) => {
  const { isLoading, error, request } = useRequest();
  const closeModalHandler = useCloseModal();


  useEffect(() => {
    const startMatch = async () => {

      await request<{ message: string }>(
        `${SERVER_URL}/api/game/match/${mode}`,
        {
          method: 'GET',
        }
      );
    };
    startMatch();

    return () => {
      const cancelMatch = async () => {
        await request<{ message: string }>(
          `${SERVER_URL}/api/game/match/${mode}`,
          {
            method: 'DELETE',
          }
        );
      };
      closeModalHandler();
    };
  }, [request, mode, closeModalHandler]);

  return (
    <Modal>
      <div className={styles.wrapper}>
        <div className={styles.header}>상대방 찾는 중..</div>
        <img src={loadingImage} alt="wait for game matching" />
        <div className={styles.feedback}>{error}</div>
        <div className={styles.footer}>
          <button
            className={`${styles['footer-button']} ${styles.cancel}`}
            onClick={closeModalHandler}
            disabled={isLoading}
          >
            CANCEL
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default GameMatchingModal;
