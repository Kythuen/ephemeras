import { group, multiselect, confirm } from '@clack/prompts'
import TEXT from '../../locales/text'
import { asyncValue, mapToList } from '../../utils'
import { featuresMap, TFeature } from '../common'

export type TRemoveFeaturesPrompt =
  | boolean
  | {
      features: TFeature[]
      confirm: boolean
    }

export function removeFeaturesPrompt(
  features: TFeature[],
  removeFeaturesText: string
) {
  return !features.length
    ? group({
        features: () =>
          features.length
            ? asyncValue(features)
            : multiselect({
                message: TEXT.REMOVE_FEATURE_CONFIRM,
                options: mapToList(featuresMap),
                required: true
              }),
        confirm: ({ results }) => {
          const removeFeatures = results.features
            .map((i: TFeature) => featuresMap[i])
            .join(' & ')
          return confirm({
            message: `${TEXT.REMOVE_FEATURE_CONFIRM} ${removeFeatures} ?`
          })
        }
      })
    : confirm({
        message: `${TEXT.REMOVE_FEATURE_CONFIRM} ${removeFeaturesText} ?`
      })
}
