import { useState } from 'react';

import { isComfortable } from '../helpers/is-comfortable';

import type { ContentDensity } from '~/types';

export function useDensityToggle(density: ContentDensity) {
  const [toggled, setToggled] = useState(isComfortable(density));

  return [toggled, setToggled] as const;
}
