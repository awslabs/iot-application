import { useState } from 'react';

export function useSideNavigationVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  return [isVisible, setIsVisible] as const;
}
