import { print } from '../utils'
import { profile } from '../utils/profile'

export async function config(
  key: string,
  value: string,
  options: Record<string, any>
) {
  const configData = profile.getData()
  if (options.list) {
    showConfigs(configData)
    return
  }
  if (options.delete) {
    profile.delete(key)
    print(`successfully delete: ${key}`)
    return
  }
  if (key && !value) {
    print(profile.get(key))
    return
  }
  if (key && value) {
    profile.getData()
    profile.set(key, value)
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
