import * as React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const error = useRouteError();

  function getErrorText() {
    return isRouteErrorResponse(error)
      ? error.statusText
      : (error as Error).message;
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{getErrorText()}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
