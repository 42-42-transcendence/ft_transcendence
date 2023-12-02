import { useDispatch } from 'react-redux';
import {
  LoaderFunctionArgs,
  useLoaderData,
  Navigate,
  defer,
  Await,
} from 'react-router-dom';
import { actions as authActions } from '../store/Auth/auth';
import { Suspense } from 'react';

type oAuthResponseData = {
  jwtToken: string;
  isFirst: string;
};

type loaderData = {
  oAuthData: oAuthResponseData | string;
};

const OAuth = () => {
  const dispatch = useDispatch();
  const { oAuthData } = useLoaderData() as loaderData;

  return (
    <Suspense fallback={<h1 style={{ textAlign: 'center' }}>...login...</h1>}>
      <Await resolve={oAuthData}>
        {(ret: oAuthResponseData | string) => {
          if (typeof ret === 'string') {
            return <h1 style={{ textAlign: 'center' }}>{ret}</h1>;
          } else {
            dispatch(authActions.setAuthToken(ret.jwtToken));
            return (
              <Navigate
                to={ret.isFirst === '' ? '/setting-profile' : '/'}
                replace={true}
              />
            );
          }
        }}
      </Await>
    </Suspense>
  );
};

const requestOAuth = async (
  request: Request
): Promise<oAuthResponseData | string> => {
  const url = new URL(request.url);
  const authCode = url.searchParams.get('code');

  try {
    const res = await fetch(`http://localhost:3001/api/auth`, {
      method: 'POST',
      body: JSON.stringify({ code: authCode }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Login Faile');
    }

    const data = await res.json();
    return data;
  } catch (e) {
    if (typeof e === 'string') return e;
    else if (e instanceof Error) return e.message;
    else return 'Something Wrong';
  }
};

const loader = ({ request }: LoaderFunctionArgs) => {
  return defer({
    oAuthData: requestOAuth(request),
  });
};

export { loader };
export default OAuth;
