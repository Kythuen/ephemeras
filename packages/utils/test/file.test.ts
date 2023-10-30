import { afterAll, describe, expect, it } from 'vitest'
import { join } from 'node:path'
import { homedir } from 'node:os'
import fs from 'fs-extra'
import { createFile, copyFile, removeFile, copyDirectory, removeDirectory } from '../src/file'

describe('# file', () => {
  const basePath = join(homedir(), '.ephemeras/utils/test')
  describe('## verify result', () => {
    it('### createFile', async () => {
      fs.ensureDirSync(basePath)
      const filePath = await createFile({
        context: basePath,
        path: 'test.js',
        data: '{"a": "1"}'
      })
      expect(fs.existsSync(filePath)).toBeTruthy()
    })
    it('### copyFile', () => {
      const newFilePath = copyFile({
        source: join(basePath, 'test.js'),
        dest: join(basePath, 'test1.js')
      })
      expect(fs.existsSync(newFilePath)).toBeTruthy()
    })
    it('### copyDirectory', () => {
      fs.ensureDirSync(join(basePath, 'source'))
      copyFile({
        source: join(basePath, 'test.js'),
        dest: join(basePath, 'source/test2.js')
      })
      const newDirPath = copyDirectory({
        source: join(basePath, 'source'),
        dest: join(basePath, 'target'),
        options: { overwrite: true }
      })
      expect(fs.existsSync(join(newDirPath, 'test2.js'))).toBeTruthy()
    })
    it('### removeFile', () => {
      const newFilePath = removeFile(join(basePath, 'test.js'))
      expect(fs.existsSync(newFilePath)).toBeFalsy()
    })
    it('### removeDirectory', () => {
      const sourceDir = removeDirectory(basePath)
      expect(fs.existsSync(sourceDir)).toBeFalsy()
    })
  })
  afterAll(() => {
    fs.removeSync(join(homedir(), '.ephemeras/utils/test'))
  })
})
