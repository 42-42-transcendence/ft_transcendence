import { useCallback, useState } from 'react';
import useAuthState from '../store/Auth/useAuthState';
import useCloseModal from '../store/Modal/useCloseModal';
import { useNavigate } from 'react-router-dom';

const useRequest = () => {
  const authState = useAuthState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const closeModal = useCloseModal();
  const navigate = useNavigate();

  const handleUnauthorized = useCallback(() => {
    closeModal();
    navigate('/login');
  }, [closeModal, navigate]);

  const request = useCallback(
    async <T>(
      url: string,
      options: RequestInit,
      isFile?: boolean
    ): Promise<T | null> => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            Authorization: 'Bearer ' + authState.token,
            ...options.headers,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          if (response.status === 401) {
            handleUnauthorized();
            throw new Error('Unauthorized');
          } else if (!error.message) {
            throw new Error(
              response.status + ' Error: Something wrong, Try again'
            );
          } else {
            throw new Error(error.message);
          }
        }

        if (isFile) {
          const blob = await response.blob();
          return { url: URL.createObjectURL(blob) } as T;
        }
        return await response.json();
      } catch (e) {
        if (typeof e === 'string') setError(e);
        else if (e instanceof Error) setError(e.message);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [authState, handleUnauthorized]
  );

  return { isLoading, error, request };
};
export default useRequest;
