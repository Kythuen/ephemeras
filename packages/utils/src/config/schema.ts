import joi from 'joi'

export const SchemaLoadConfigFile = joi.string().required()
export const SchemaLoadConfigOptions = joi
  .object({
    files: joi.array().items(joi.string()),
    context: joi.string()
  })
  .optional()
