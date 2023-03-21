import { applyDensity, Density } from '@cloudscape-design/global-styles';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';

import { isComfortable } from '../helpers/is-comfortable';
import { CONTENT_DENSITY_KEY, DEFAULT_CONTENT_DENSITY } from '~/constants';

import type { ContentDensity } from '~/types';

const CONTENT_DENSITY_INITIALIZER = DEFAULT_CONTENT_DENSITY;

export function useDensity() {
  const [density = DEFAULT_CONTENT_DENSITY, setDensity] =
    useLocalStorage<ContentDensity>(
      CONTENT_DENSITY_KEY,
      CONTENT_DENSITY_INITIALIZER,
    );

  function applyDensitySetting() {
    const densitySetting = isComfortable(density)
      ? Density.Comfortable
      : Density.Compact;

    applyDensity(densitySetting);
  }

  // apply density when it is updated
  useEffect(applyDensitySetting, [density]);

  return [density, setDensity] as const;
}
