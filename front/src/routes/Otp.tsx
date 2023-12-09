import styles from '../styles/Otp.module.css';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../App';
import useRequest from '../http/useRequest';
import { useDispatch } from 'react-redux';
import { actions as authActions } from '../store/Auth/auth';

const Otp = () => {
  const location = useLocation();
  const jwtToken = location.state?.jwtToken;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const { isLoading, error, request } = useRequest();
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

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
      `${SERVER_URL}/api/otp/login`,
      {
        method: 'POST',
        body: JSON.stringify({ otp: enteredOtp }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwtToken,
        },
      }
    );

    if (ret !== null) {
      dispatch(authActions.setAuthToken(jwtToken));
      navigate('/');
    }
  };

  if (jwtToken === null) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <main>
      <h1>2차 인증</h1>
      <form onSubmit={submitHandler} className={styles.otp}>
        <label htmlFor="otp" className={styles['otp-label']}>
          OTP 입력
        </label>
        <input
          type="text"
          id="otp"
          className={styles['otp-input']}
          maxLength={6}
          placeholder="공백 없이 입력"
          value={enteredOtp}
          onChange={changeOtpHandler}
        />
        <div className={styles.feedback}>{feedbackMessage}</div>
        <button type="submit" disabled={isLoading} className={styles.submit}>
          Submit
        </button>
      </form>
    </main>
  );
};
export default Otp;
