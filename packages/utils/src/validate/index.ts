import joi from 'joi'
import type { AnySchema } from 'joi'

export { joi }

export function validateParam(name: string, value: any, schema: AnySchema) {
  const { error: nameError } = joi
    .string()
    .label('name')
    .required()
    .validate(name)
  if (nameError) throw nameError

  if (!schema || !joi.isSchema(schema)) {
    throw new Error('"schema" must be a joi schema')
  }

  const { error: valueError } = joi.any().label(name).required().validate(value)
  if (valueError) throw valueError

  const { error } = schema
    .options({ convert: false })
    .label(name)
    .validate(value)
  if (error) throw error

  return true
}

export interface ValidateParamsOptionsItem {
  name: string
  value: any
  schema: AnySchema
}
export function validateParams(options: ValidateParamsOptionsItem[]) {
  validateParam('options', options, joi.array().required())
  for (const item of options) {
    validateParam(item.name, item.value, item.schema)
  }
  return true
}
