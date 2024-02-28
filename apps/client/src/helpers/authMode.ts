import { extractedMetaTags } from './meta-tags';

export const getAuthMode = () => {
  const tags = Array.from(document.getElementsByTagName('meta'));
  const { authMode } = extractedMetaTags(tags);
  return authMode;
};
