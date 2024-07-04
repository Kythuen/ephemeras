import { join } from 'node:path'
import { readdir, unlink, rmdir } from 'node:fs/promises'

export async function emptyDir(path: string) {
  const items = await readdir(path, { withFileTypes: true })
  for (const item of items) {
    const subPath = join(path, item.name)
    if (item.isDirectory()) {
      await emptyDir(subPath)
      if (!(await readdir(subPath)).length) {
        await rmdir(subPath)
      }
      continue
    }
    await unlink(subPath)
  }
}
