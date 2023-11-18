import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  let errorMessage;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Sorry, an unexpected error has occurred.';
  }

  return (
    <>
      <main>
        <h1>Error Page</h1>
        <p>{errorMessage}</p>
      </main>
    </>
  );
};
export default ErrorPage;
