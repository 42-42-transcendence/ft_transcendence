import { useCallback, useState } from 'react';
import useAuthState from '../store/Auth/useAuthState';

/**
 * 성공 시: json 형태로 <T> 형태로 리턴 (객체를 기대함)
 * 실패 시: text로 받아서 error 설정 후 null 리턴
 */
const useRequest = () => {
  const authState = useAuthState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const request = useCallback(
    async <T>(url: string, options: RequestInit): Promise<T | null> => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: 'Bearer ' + authState.token,
          },
        });

        if (!response.ok) {
          const error = await response.json();

          if (!error.message)
            throw new Error(
              response.status + ' Error: Something wrong, Try again'
            );
          else throw new Error(error.message);
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
    [authState]
  );

  return { isLoading, error, request };
};
export default useRequest;
