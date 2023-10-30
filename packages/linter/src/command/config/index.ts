import { Profile } from '@ephemeras/utils'
import TEXT from '../../locales/text'
import { boldText } from '../../utils'

const profile = new Profile({ path: '.ephemeras/linter/config.json' })

function showConfigs(configs: Record<string, any>) {
  if (!Object.keys(configs).length) {
    console.log(TEXT.TIP_NO_DATA)
    return
  }
  console.log(`${TEXT.TITLE_CONFIG_LIST}\n`)
  const configsText: any = []
  Object.keys(configs).forEach(key => {
    configsText.push(`${key}=${configs[key]}`)
  })
  console.log(configsText.join('\n'))
}

export default async function (
  configKey: string,
  configValue: string,
  options: Record<string, any>
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
    console.log(boldText(`${TEXT.TIP_SUCCESS_DELETE}: ${configKey}`))
    return
  }
  if (configKey && configValue) {
    profile.set(configKey, configValue)
    console.log(boldText(TEXT.TIP_SUCCESS_OPERATION))
  }
}
