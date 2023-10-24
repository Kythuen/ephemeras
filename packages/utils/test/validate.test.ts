import { describe, expect, it } from 'vitest'
import joi from 'joi'
import { validateParam, validateParams } from '../src/validate'

describe('# validate', () => {
  describe('## validateParam', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '#### no params',
          params: [undefined],
          error: '"name" is required'
        },
        {
          name: '#### invalid params: schema',
          params: ['name1', 'name1Value', 'name1Schema'],
          error: '"schema" must be a joi schema'
        },
        {
          name: '#### invalid params: required value',
          params: ['name2', undefined, joi.string().required()],
          error: '"name2" is required'
        },
        {
          name: '#### invalid params: error value type',
          params: ['name2', 1, joi.string().required()],
          error: '"name2" must be a string'
        }
      ]
      for (const item of cases) {
        it(item.name, () => {
          expect(() => {
            // @ts-ignore
            validateParam(...item.params)
          }).toThrowError(item.error)
        })
      }
    })
    describe('### verify result', () => {
      const cases = [
        {
          name: '#### string type',
          params: ['string', 'a string', joi.string()],
          result: true
        },
        {
          name: '#### number type',
          params: ['number', 1, joi.number()],
          result: true
        },
        {
          name: '#### object type',
          params: ['object', {}, joi.object()],
          result: true
        },
        {
          name: '#### array type',
          params: ['array', [1, 2, 3], joi.array().items(joi.number())],
          result: true
        }
      ]
      for (const item of cases) {
        it(item.name, () => {
          expect(
            // @ts-ignore
            validateParam(...item.params)
          ).toBe(item.result)
        })
      }
    })
  })
  describe('## validateParams', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '#### no options',
          parameters: undefined,
          error: '"options" is required'
        },
        {
          name: '#### invalid options type',
          parameters: 1,
          error: '"options" must be an array'
        },
        {
          name: '#### invalid options item: name type',
          parameters: [
            {
              name: 1,
              value: 'bbb',
              schema: joi.string().required()
            }
          ],
          error: '"name" must be a string'
        },
        {
          name: '#### invalid options item: schema type',
          parameters: [
            {
              name: 'aaa',
              value: 'bbb',
              schema: 'not joi schema'
            }
          ],
          error: '"schema" must be a joi schema'
        }
      ]
      for (const item of cases) {
        it(item.name, () => {
          expect(() => {
            // @ts-expect-error
            validateParams(item.parameters)
          }).toThrowError(item.error)
        })
      }
    })
    describe('### verify result', () => {
      const cases = [
        {
          name: '#### empty options',
          parameters: [],
          result: true
        },
        {
          name: '#### error value type',
          parameters: [
            {
              name: 'a',
              schema: joi.string(),
              value: []
            }
          ],
          error: '"a" must be a string'
        },
        {
          name: '#### correct value type',
          parameters: [
            {
              name: 'a',
              schema: joi.string(),
              value: 'abc'
            },
            {
              name: 'b',
              schema: joi.number(),
              value: 3
            },
            {
              name: 'c',
              schema: joi.array().items(joi.string()),
              value: ['abc']
            }
          ],
          result: true
        }
      ]
      for (const item of cases) {
        it(item.name, () => {
          if (item.error) {
            expect(() => {
              validateParams(item.parameters)
            }).toThrowError(item.error)
            return
          }
          expect(validateParams(item.parameters)).toBe(item.result)
        })
      }
    })
  })
})
