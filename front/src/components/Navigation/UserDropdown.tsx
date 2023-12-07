import styles from '../../styles/Navigation.module.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions as authActions } from '../../store/Auth/auth';
import { actions as userActions } from '../../store/User/user';
import { SERVER_URL } from '../../App';
import useUserState from '../../store/User/useUserState';
import useRequest from '../../http/useRequest';
import { useEffect, useState } from 'react';

type Props = {
  onOpenQRCodeModal: (qrCodeURL: string) => void;
};

const UserDropdown = ({ onOpenQRCodeModal }: Props) => {
  const userState = useUserState();
  const [otpIsActivated, setOtpIsActivated] = useState<boolean | null>(null);
  const dispatch = useDispatch();
  const { isLoading, error, request } = useRequest();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOtpInfo = async () => {
      const ret = await request<{ isActive: boolean }>(
        `${SERVER_URL}/api/otp`,
        {
          method: 'GET',
        }
      );

      if (ret !== null) {
        setOtpIsActivated(ret.isActive);
      }
    };

    fetchOtpInfo();
  }, [request]);

  const navigateHandler = () => {
    navigate(`/profile/${userState.id}`);
  };

  const logoutHandler = () => {
    dispatch(authActions.clearAuth());
    dispatch(userActions.clearUser());
    navigate('/login');
  };

  const activateOtpHandler = async () => {
    const ret = await request<{ url: string }>(
      `${SERVER_URL}/api/otp`,
      {
        method: 'POST',
      },
      true
    );

    if (ret !== null) {
      onOpenQRCodeModal(ret.url);
    }
  };

  const deactivateOtpHandler = async () => {
    await request<{ message: string }>(`${SERVER_URL}/api/otp`, {
      method: 'DELETE',
    });
  };

  if (otpIsActivated === null || error) return <></>;
  return (
    <ul className={styles.dropdown}>
      <li className={styles['dropdown-list']}>
        <button onClick={navigateHandler}>내 프로필</button>
      </li>
      <li className={styles['dropdown-list']}>
        {isLoading && <></>}
        {!otpIsActivated && (
          <button onClick={activateOtpHandler} disabled={isLoading}>
            2차 인증 켜기
          </button>
        )}
        {otpIsActivated && (
          <button onClick={deactivateOtpHandler} disabled={isLoading}>
            2차 인증 끄기
          </button>
        )}
      </li>
      <li className={styles['dropdown-list']}>
        <button onClick={logoutHandler}>로그아웃</button>
      </li>
    </ul>
  );
};
export default UserDropdown;
