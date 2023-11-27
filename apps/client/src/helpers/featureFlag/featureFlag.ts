export const Features = {};

/**
 * Caution:
 * This array shows/hides features that customers see.
 * We should use this for in-development features and remove the flags when releasing.
 */
export const supportedFeatures: string[] = [];

export const featureEnabled = (feature: string) => {
  return supportedFeatures.includes(feature);
};
