import { useDispatch } from 'react-redux';
import {
  LoaderFunctionArgs,
  useLoaderData,
  json,
  Navigate,
  defer,
  Await,
} from 'react-router-dom';
import { actions as authActions } from '../store/auth';
import { Suspense } from 'react';

type oAuthResponseData = {
  jwtToken: string;
  isSignUp: boolean;
};

type loaderData = {
  oAuthData: oAuthResponseData;
};

const OAuth = () => {
  const dispatch = useDispatch();
  const data = useLoaderData() as loaderData;

  return (
    <Suspense fallback={<h1 style={{ textAlign: 'center' }}>...login...</h1>}>
      <Await resolve={data.oAuthData}>
        {(auth) => {
          dispatch(authActions.setAuthToken(auth.jwtToken));
          return (
            <Navigate
              to={auth.isSignUp ? '/' : '/setting-profile'}
              replace={true}
            />
          );
        }}
      </Await>
    </Suspense>
  );
};
export default OAuth;

const requestOAuth = async (request: Request) => {
  const url = new URL(request.url);
  const authCode = url.searchParams.get('code');

  const res = await fetch('http://localhost:3001/api/auth', {
    method: 'POST',
    body: JSON.stringify({ code: authCode }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw json({ message: '로그인에 실패하였습니다' }, { status: 500 });
  }

  const data = await res.json();
  return data;
};

export const loader = ({ request }: LoaderFunctionArgs) => {
  return defer({
    oAuthData: requestOAuth(request),
  });
};
