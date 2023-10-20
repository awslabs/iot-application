export const Features = {
  MIGRATION: 'Migration',
};

/**
 * Caution:
 * This array shows/hides features that customers see.
 * We should use this for in-development features and remove the flags when releasing.
 */
export const supportedFeatures: string[] = [
  /*Features.MIGRATION*/
];

export const featureEnabled = (feature: string) => {
  return supportedFeatures.includes(feature);
};
