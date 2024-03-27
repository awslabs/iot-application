import { useEffect } from 'react';
import { signOut } from 'aws-amplify/auth';

export function useDetect401Unauthorized() {
  useEffect(() => {
    navigator.serviceWorker.addEventListener(
      'message',
      handleServiceWorkerMessage,
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        'message',
        handleServiceWorkerMessage,
      );
    };
  }, []);
}

function handleServiceWorkerMessage(event: MessageEvent<{ type?: string }>) {
  if (event.data.type === '401_UNAUTHORIZED') {
    void signOut();
  }
}
