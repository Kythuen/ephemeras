import { cancel, isCancel } from '@clack/prompts'
import TEXT from '../locales/text'

export const supportFeatures = ['format', 'commit'] as const
export type TFeature = (typeof supportFeatures)[number]

export const featuresMap: Record<TFeature, string> = {
  format: TEXT.COMMON_FEATURE_FORMAT,
  commit: TEXT.COMMON_FEATURE_COMMIT
}

export function cancelHandler(result: any) {
  if (isCancel(result)) {
    cancel(TEXT.COMMON_CANCEL_OPERATION)
    process.exit(0)
  }
}
