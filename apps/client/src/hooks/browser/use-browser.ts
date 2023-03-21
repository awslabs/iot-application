import { useNavigate } from 'react-router-dom';

export function useBrowser() {
  const navigate = useNavigate();

  return {
    navigate,
  };
}
