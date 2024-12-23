export function listIntersection<T>(list: T[], target: T | T[]) {
  const targetArray = Array.isArray(target) ? target : [target]
  return targetArray.filter(str => list.includes(str))
}
export function listToMap(
  list: Record<string, any>[],
  keyProp: string = 'value'
) {
  const result: Record<string, any> = {}
  for (const item of list) {
    result[item[keyProp]] = item
  }
  return result
}
export function mapToList(map: Record<string, any>) {
  const result: any[] = []
  for (const key in map) {
    result.push({
      label: map[key],
      value: key
    })
  }
  return result
}

type TMergeOptions = {
  arrayStrategy?: 'replace' | 'concat'
}
function isObject(item: unknown): item is Record<string, unknown> {
  return Object.prototype.toString.call(item) === '[object Object]'
}
export function deepMerge(
  target: object,
  source: object,
  options: TMergeOptions = {}
): object {
  const { arrayStrategy = 'replace' } = options
  const output: any = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.entries(source).forEach(([key, value]) => {
      if (isObject(value)) {
        if (!(key in target)) Object.assign(output, { [key]: value })
        else output[key] = deepMerge(target[key] as object, value, options)
      } else if (Array.isArray(value)) {
        if (!(key in target)) Object.assign(output, { [key]: value })
        else if (arrayStrategy === 'replace') output[key] = value
        else if (arrayStrategy === 'concat')
          output[key] = [...(target[key] as []), ...value]
      } else {
        Object.assign(output, { [key]: value })
      }
    })
  }
  return output
}

export function removePackagesVersion(packages: string[]): string[] {
  const versionRegex = /@(\d+\.)?(\d+\.)?(\*|\d+)/ig
  return packages.map((pkg) => pkg.replace(versionRegex, ''))
}
