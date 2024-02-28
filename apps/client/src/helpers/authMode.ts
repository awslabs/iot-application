import { extractedMetaTags } from './meta-tags';
import once from 'lodash/once';

export const getAuthMode = once(() => {
  const tags = Array.from(document.getElementsByTagName('meta'));
  const { authMode } = extractedMetaTags(tags);
  return authMode;
});
