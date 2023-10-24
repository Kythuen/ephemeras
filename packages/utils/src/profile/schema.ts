import joi from 'joi'

export const SchemaProfileOptions = joi.object({
  path: joi.string().required(),
  base: joi.string(),
  data: joi.object().strict(),
  serializer: joi.function().minArity(1),
  transformer: joi.function().minArity(1),
}).and('serializer', 'transformer')
