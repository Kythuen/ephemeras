import TEXT from '../../locales/text'
import { configProfile, Bold } from '../../utils'

export default async function (
  configKey: string,
  configValue: string,
  options: Record<string, any>
) {
  const configData = configProfile.getData()
  if (options.list) {
    showConfigs(configData)
    return
  }
  if (options.get) {
    console.log(configData[configKey])
    return
  }
  if (options.unset) {
    configProfile.delete(configKey)
    console.log(Bold(`${TEXT.TIP_SUCCESS_DELETE}: ${configKey}`))
    return
  }
  if (configKey && configValue) {
    configProfile.set(configKey, configValue)
    console.log(Bold(TEXT.TIP_SUCCESS_OPERATION))
  }
}

function showConfigs(configs: Record<string, any>) {
  if (!Object.keys(configs).length) {
    console.log(TEXT.TIP_NO_DATA)
    return
  }
  // console.log(`${TEXT.TITLE_CONFIG_LIST}\n`)
  const configsText: any = []
  Object.keys(configs).forEach(key => {
    configsText.push(`${key}=${configs[key]}`)
  })
  console.log(configsText.join('\n'))
}
