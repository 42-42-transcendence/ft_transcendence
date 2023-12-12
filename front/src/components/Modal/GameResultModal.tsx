import React from 'react';
import Modal from '../../UI/Modal';
import styles from '../../styles/Modal.module.css';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../App';

type Props = {
    result: 'win' | 'lost';
};

const sendEndGameRequest = () => {
    const response = fetch(`${SERVER_URL}/인게임/종료`, {
        method: 'GET',
    });
}

const GameResultModal = ({ result }: Props) => {
    const navigate = useNavigate();

    const closeAndRedirectHandler = () => {
        sendEndGameRequest();
        navigate('/');
    };

    return (
        <Modal>
            <div className={styles.wrapper}>
                <div className={styles.header}>{result === 'win' ? '승리!' : '패배...'}</div>
                <div className={styles.footer}>
                    <button
                        className={`${styles['footer-button']} ${styles.cancel}`}
                        onClick={closeAndRedirectHandler}
                    >
                        종료
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default GameResultModal;
