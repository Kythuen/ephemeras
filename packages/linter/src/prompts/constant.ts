const PROMPT_DATA_ADD = {
  preset: '',
  features: [],
  environment: [],
  framework: '',
  typescript: false,
  commitHook: false,
  commitMessage: false,
  save: false,
  install: false,
  packageManager: ''
}
const PROMPT_DATA_REMOVE = {
  preset: '',
  features: [],
  environment: [],
  framework: '',
  typescript: false,
  commitHook: false,
  commitMessage: false,
  save: false,
  install: false,
  packageManager: ''
}

export const DEFAULT_PROMPT_DATA = {
  add: PROMPT_DATA_ADD,
  remove: PROMPT_DATA_REMOVE
}
