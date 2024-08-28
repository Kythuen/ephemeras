import { describe, expect, it } from 'vitest'
import { File } from '../src'

describe('# match', () => {
  it('## Transform', () => {
    const code = `export const COMPONENTS_GROUP: Record<string, string[]> = {
      A: 'aa',
      Base: ['space'],
      Form: ['button', 'button1', 'button2'],
      Data: ['table']
    }`
    const file = new File()
    file.setCode(code)
    file.get('COMPONENTS_GROUP').get('Form').add('select').remove('button1')
    file
      .root()
      .get('COMPONENTS_GROUP')
      .set('A', ['AAA'])
      .set('BC', { C: 'BBB' })
      .set('D', 1)
    file.get('COMPONENTS_GROUP').get('Form').add({ a: 1 })
    file.root().get('COMPONENTS_GROUP').delete('Data').save()
    expect(file.getCode())
      .toBe(`export const COMPONENTS_GROUP: Record<string, string[]> = {
  A: ["AAA"],
  Base: ["space"],
  Form: [
    "button",
    "button2",
    "select",
    {
      a: 1,
    },
  ],
  BC: {
    C: "BBB",
  },
  D: 1,
};
`)
  })
})
