export const supportFeatures = ['format', 'commit'] as const
export type TFeature = (typeof supportFeatures)[number]
