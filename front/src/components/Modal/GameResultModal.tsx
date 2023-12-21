import React, {useCallback} from 'react';
import Modal from '../../UI/Modal';
import styles from '../../styles/Modal.module.css';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../App';
import useRequest from "../../http/useRequest";

type Props = {
    result: 'win' | 'lost';
};

const GameResultModal = ({ result }: Props) => {
    const navigate = useNavigate();
    const { request } = useRequest();
    const sendEndGameRequest = useCallback(async () => {
        const response = await request(`${SERVER_URL}/api/game/exitGame`, {
            method: 'POST',
        });
        if (response === null) {
            console.log("response is null");
        }
    }, [request]);

    const closeAndRedirectHandler = () => {
        sendEndGameRequest();
        navigate('/', { replace: true });
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
