import joi from 'joi'

export const SchemaCreateFile = joi.object({
  context: joi.string(),
  path: joi.string().required(),
  data: joi.any()
})

export const SchemaCopyFile = joi.object({
  source: joi.string().required(),
  dest: joi.string().required(),
  options: joi.object()
})

export const SchemaRemoveFile = joi.string().required()
export const SchemaReadPKG = joi.array().items(joi.string()).required()
