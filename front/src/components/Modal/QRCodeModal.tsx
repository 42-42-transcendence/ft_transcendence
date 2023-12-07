import { useEffect, useState } from 'react';
import Modal from '../../UI/Modal';
import useRequest from '../../http/useRequest';
import useCloseModal from '../../store/Modal/useCloseModal';
import styles from '../../styles/Modal.module.css';
import { SERVER_URL } from '../../App';

type Props = {
  qrCodeURL: string;
};

const QRCodeModal = ({ qrCodeURL }: Props) => {
  const closeHandler = useCloseModal();
  const { isLoading, error, request } = useRequest();
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');

  useEffect(() => {
    if (error) {
      setFeedbackMessage(error);
    }
  }, [error]);

  const changeOtpHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredOtp(e.target.value);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (enteredOtp.length !== 6) {
      setFeedbackMessage('유효한 OTP길이를 입력하세요.');
      return;
    }

    if (isNaN(+enteredOtp)) {
      setFeedbackMessage('정수만 입력하세요.');
      return;
    }

    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/otp/validate`,
      {
        method: 'POST',
        body: JSON.stringify({ otp: enteredOtp }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (ret !== null) {
      closeHandler();
    }
  };

  return (
    <Modal>
      <form method="POST" onSubmit={submitHandler}>
        <div className={styles.header}>2차 인증 등록</div>
        <div className={styles.wrapper}>
          <p className={styles['otp-detail']}>
            최초 인증 성공 시 2차 인증이 활성화됩니다.
          </p>
          <img src={qrCodeURL} alt="qrcode" />
        </div>
        <div className={styles.otp}>
          <label htmlFor="otp" className={styles['otp-label']}>
            OTP 입력
          </label>
          <input
            className={styles['otp-input']}
            type="text"
            id="otp"
            maxLength={6}
            placeholder="- 빼고 입력"
            value={enteredOtp}
            onChange={changeOtpHandler}
          />
        </div>
        <div className={styles.feedback}>{feedbackMessage}</div>
        <div className={styles.footer}>
          <button
            type="submit"
            className={`${styles['footer-button']} ${styles.confirm}`}
            disabled={isLoading}
          >
            SUBMIT
          </button>
          <button
            type="button"
            className={`${styles['footer-button']} ${styles.cancel}`}
            disabled={isLoading}
            onClick={closeHandler}
          >
            CANCEL
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default QRCodeModal;
