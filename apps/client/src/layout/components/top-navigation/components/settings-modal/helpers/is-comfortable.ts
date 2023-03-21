import type { Comfortable, ContentDensity } from '~/types';

export function isComfortable(density: ContentDensity): density is Comfortable {
  return density === 'comfortable';
}
