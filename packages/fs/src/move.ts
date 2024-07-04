import { minimatch } from 'minimatch'
import { readdir, rename, rmdir } from 'node:fs/promises'
import { basename, join, dirname, resolve } from 'node:path'
import { toRelativePath, toUnixPath } from './common'
import { stats } from './stat'
import { exists } from './exist'
import { CopyOptions, copy } from './copy'
import { ensure } from './ensure'
import { remove } from './remove'

export type MoveOptions = CopyOptions
export type MoveResult = {
  src: string[]
  dest: string[]
  add: string[]
  update: string[]
  skip: string[]
}

export async function renameMove(
  src: string,
  dest: string,
  options: Partial<MoveOptions>,
  summary: MoveResult
) {
  const {
    overwrite = false,
    includes,
    excludes,
    filter,
    beforeEach,
    afterEach
  } = options || {}

  let srcPath = toUnixPath(src)
  let destPath = toUnixPath(dest)

  const context = options.context
  if (context) {
    srcPath = toUnixPath(resolve(context, src))
    destPath = toUnixPath(resolve(context, dest))
  } else {
    options.context = dirname(srcPath)
  }

  const srcStats = await stats(src)

  if (!srcStats) return

  const isLeaf =
    srcStats.isFile() ||
    (srcStats.isDirectory() && !(await readdir(srcPath)).length)

  if (isLeaf) {
    const destExist = await exists(dest)
    const srcItem = toRelativePath(srcPath, options.context)
    const destItem = toRelativePath(destPath, options.context)

    summary.src.push(srcItem)

    if (
      includes?.length &&
      includes.every(p => !minimatch(srcPath, p, { dot: true }))
    ) {
      summary.skip.push(srcItem)
      return
    }

    if (
      excludes?.length &&
      excludes.some(p => minimatch(srcPath, p, { dot: true }))
    ) {
      summary.skip.push(srcItem)
      return
    }

    if (filter && !filter(srcPath, srcStats)) {
      summary.skip.push(srcItem)
      return
    }

    if (destExist) {
      summary.dest.push(destItem)
      if (!overwrite) {
        summary.skip.push(srcItem)
        return
      }
      summary.update.push(destItem)
    } else {
      summary.dest.push(destItem)
      summary.add.push(destItem)
    }
    if (beforeEach) {
      await beforeEach(src, dest)
    }
    await rename(srcPath, destPath)
    if (afterEach) {
      await afterEach(src, dest)
    }
    return
  }

  await ensure(destPath, 'dir')

  const items = (await readdir(srcPath, { withFileTypes: true })) || []
  for (const item of items) {
    const itemSrc = join(srcPath, item.name)
    const itemDest = join(destPath, item.name)
    await renameMove(itemSrc, itemDest, options, summary)
  }

  if (!(await readdir(srcPath)).length) {
    await rmdir(srcPath)
  }

  if (!(await readdir(destPath)).length) {
    await rmdir(destPath)
  }
}

export async function generalMove(
  src: string,
  dest: string,
  options: Partial<MoveOptions>,
  summary: MoveResult
) {
  const srcPath = toUnixPath(src)
  const destPath = toUnixPath(dest)

  summary = await copy(srcPath, destPath, options)

  const doneRelative = [...summary.add, ...summary.update].map(i =>
    i.substring(basename(srcPath).length + 1)
  )

  await remove(srcPath, {
    filter: path => {
      const a = toRelativePath(path, srcPath)
      const b = doneRelative.includes(toUnixPath(a))
      return b
    }
  })

  if ((await exists(srcPath)) && !(await readdir(srcPath)).length) {
    rmdir(srcPath)
  }
}

/**
 * Move file or dir.
 *
 * @param src Source file or dir, `string`.
 * @param dest Destination file or dir, `string`.
 * @param options Move options, `MoveOptions`.
 *
 * @example
 * import { move } from '@ephemeras/fs'
 *
 * await move(srcPath, destPath, { overwrite: true })
 */
export async function move(
  src: string,
  dest: string,
  options?: Partial<MoveOptions>
) {
  options = options || {}

  const srcPath = toUnixPath(src)
  const destPath = toUnixPath(dest)

  const summary: MoveResult = {
    src: [],
    dest: [],
    add: [],
    update: [],
    skip: []
  }

  try {
    await renameMove(srcPath, destPath, options, summary)
    return summary
  } catch (err: any) {
    if (err?.code === 'EXDEV') {
      await generalMove(srcPath, destPath, options, summary)
      return summary
    }
    throw err
  }
}
