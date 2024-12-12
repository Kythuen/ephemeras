import { parse } from 'node:path'

export const DISK = parse(process.cwd()).root.replace(/\\/g, '/')

export function noDisk(path: string) {
  return path.replace(/\\/g, '/').replace(new RegExp(DISK), '/')
}
