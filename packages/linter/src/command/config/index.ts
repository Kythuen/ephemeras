import { Profile } from '@ephemeras/utils'
import TEXT from '../../locales/text'

function showConfigs(configs: Record<string, any>) {
  if (!Object.keys(configs).length) {
    console.log(TEXT.COMMON_NO_DATA)
    return
  }
  const configsText: any = []
  Object.keys(configs).forEach(key => {
    configsText.push(`${key}=${configs[key]}`)
  })
  console.log(configsText.join('\n'))
}

export default async function (
  configKey: string,
  configValue: string,
  options: Record<string, any>,
  profile: Profile
) {
  const configData = profile.getData()
  if (options.list) {
    showConfigs(configData)
    return
  }
  if (options.get) {
    console.log(configData[configKey])
    return
  }
  if (options.unset) {
    profile.delete(configKey)
    console.log(`${TEXT.COMMON_SUCCESS_DELETE}: ${configKey}`)
    return
  }
  if (configKey && configValue) {
    profile.set(configKey, configValue)
    console.log(TEXT.COMMON_SUCCESS_OPERATION)
  }
}
