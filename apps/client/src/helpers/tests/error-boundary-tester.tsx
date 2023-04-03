import { useState } from 'react';

export function ErrorBoundaryTester() {
  const [throwError, setThrowError] = useState(false);

  if (throwError) {
    throw new Error();
  }

  return (
    <>
      <div>not an error fallback</div>
      <button onClick={() => setThrowError(true)}>throw error</button>
    </>
  );
}
