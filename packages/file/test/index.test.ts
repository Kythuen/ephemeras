import { homedir } from 'node:os'
import { join } from 'node:path'
import { mkdir, writeFile, unlink } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { File } from '../src'

const TEMP_ROOT = join(homedir(), '.ephemeras/file/Temp')
const TEST_FILE = join(TEMP_ROOT, 'test.ts')

describe('# File', () => {
  it('## constructor', () => {
    const code = `export const A = {
        B: 'bb',
        C: ['cc', 'dd', 11],
        D: { E: 'ee' }
      }`
    const file = new File()
    file.init(code)

    // @ts-ignore
    expect(file.currentNode.type).toBe('File')
    // @ts-ignore
    expect(file.ast.type).toBe('File')
    // @ts-ignore
    expect(file.code).toBe(code)
    expect(file.text()).toBe(code)
  })
  it('## root & get & json', () => {
    const code = `export const A = {
      B: 'bb',
      C: ['cc', 'dd', 11],
      D: { E: 'ee' }
    }`
    const file = new File()
    file.init(code)

    expect(file.get('A').json()).toEqual({
      B: 'bb',
      C: ['cc', 'dd', 11],
      D: { E: 'ee' }
    })
    // @ts-ignore
    expect(file.currentNode.type).toBe('VariableDeclarator')

    expect(file.root().get('A').get('D').json()).toEqual({ E: 'ee' })
    // @ts-ignore
    expect(file.currentNode.type).toBe('ObjectProperty')

    expect(file.root().get('A').get('C').json()).toEqual(['cc', 'dd', 11])
    expect(file.root().get('A').get('C').get(1).json()).toBe('dd')
    expect(file.root().get('A').get('C').get(2).json()).toBe(11)
  })
  it('## set', () => {
    const code = `export const A = {
      B: 'bb',
      C: ['cc', 'dd', 11],
      D: { E: 'ee' }
    }`
    const file = new File()
    file.init(code)

    file.root().get('A').set('F', 666)
    file.root().get('A').set('G', ['hh', 'ii', 22])
    file.root().get('A').set('J', { K: 'll' })
    expect(file.root().get('A').json()).toEqual({
      B: 'bb',
      C: ['cc', 'dd', 11],
      D: { E: 'ee' },
      F: 666,
      G: ['hh', 'ii', 22],
      J: { K: 'll' }
    })

    file.root().get('A').set('B', 'bbb')
    file.root().get('A').set('C', { aaa: 111 })
    expect(file.root().get('A').json()).toEqual({
      B: 'bbb',
      C: { aaa: 111 },
      D: { E: 'ee' },
      F: 666,
      G: ['hh', 'ii', 22],
      J: { K: 'll' }
    })

    file.root().get('A').get('G').set(1, { iii: 1 })
    file.root().get('A').get('G').set(3, ['mmm'])
    file.root().get('A').get('G').set(-1, ['n'])
    expect(file.root().get('A').json()).toEqual({
      B: 'bbb',
      C: { aaa: 111 },
      D: { E: 'ee' },
      F: 666,
      G: ['hh', { iii: 1 }, 22, ['mmm']],
      J: { K: 'll' }
    })
  })
  it('## delete', () => {
    const code = `export const A = {
      B: 'bb',
      C: ['cc', 'dd', 11],
      D: { E: 'ee' }
    }`
    const file = new File()
    file.init(code)

    file.root().get('A').delete('D')
    file.root().get('A').get('C').delete(2)
    expect(file.root().get('A').json()).toEqual({
      B: 'bb',
      C: ['cc', 'dd']
    })
  })
  it('## save', async () => {
    const code = `export const A = {
      B: 'bb',
      C: ['cc', 'dd', 11],
      D: { E: 'ee' }
    }`
    await mkdir(TEMP_ROOT, { recursive: true })
    await writeFile(TEST_FILE, code, { encoding: 'utf-8' })
    const file = new File(TEST_FILE)

    file.root().get('A').delete('D')
    file.root().get('A').get('C').delete(2)

    await file.save()

    expect(file.root().get('A').json()).toEqual({
      B: 'bb',
      C: ['cc', 'dd']
    })

    await unlink(TEST_FILE)
  })
  it('## constructor file', async () => {
    const code = `export const A = {
      B: 'bb',
      C: ['cc', 'dd', 11],
      D: { E: 'ee' }
    }`
    await mkdir(TEMP_ROOT, { recursive: true })
    await writeFile(TEST_FILE, code, { encoding: 'utf-8' })

    const file = new File(TEST_FILE)

    expect(file.get('A').json()).toEqual({
      B: 'bb',
      C: ['cc', 'dd', 11],
      D: { E: 'ee' }
    })
    // @ts-ignore
    expect(file.currentNode.type).toBe('VariableDeclarator')

    expect(file.root().get('A').get('D').json()).toEqual({ E: 'ee' })
    // @ts-ignore
    expect(file.currentNode.type).toBe('ObjectProperty')

    expect(file.root().get('A').get('C').json()).toEqual(['cc', 'dd', 11])
    expect(file.root().get('A').get('C').get(1).json()).toBe('dd')
    expect(file.root().get('A').get('C').get(2).json()).toBe(11)

    await unlink(TEST_FILE)
  })
})
