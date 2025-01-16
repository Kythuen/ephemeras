import { print } from '../utils'
import { profile } from '../utils/profile'

export async function config(
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
    print(JSON.stringify(configData[configKey]))
    return
  }
  if (options.unset) {
    profile.delete(configKey)
    print(`successfully delete: ${configKey}`)
    return
  }
  if (configKey && configValue) {
    profile.set(configKey, configValue)
    print('successfully operation')
  }
}

function showConfigs(configs: Record<string, any>) {
  if (!Object.keys(configs).length) {
    print('no data found')
    return
  }
  const configsText: any = []
  Object.keys(configs).forEach(key => {
    configsText.push(`${key}=${JSON.stringify(configs[key])}`)
  })
  console.log(configsText.join('\n'))
}
