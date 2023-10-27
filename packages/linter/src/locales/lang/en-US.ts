const USAGE = {
  ROOT_OPTION_INITIAL: 'initial code linter into your code',
  ROOT_OPTION_CLEAR: 'remove code linter from your code',
  ROOT_OPTION_PRESET: 'use preset to initial code linter for your code',
  COMMAND_INITIAL: 'add code linter features into your code manually',
  COMMAND_CLEAR: 'remove code linter features from your code manually',
  COMMAND_ADD: 'add target features into your code: format, commit',
  COMMAND_REMOVE: 'remove target features into your code: format, commit',
  COMMAND_PRESET: 'presets for code linter',
  COMMAND_PRESET_OPTION_LIST: 'display all existing presets',
  COMMAND_PRESET_OPTION_ADD: 'get preset item',
  COMMAND_PRESET_OPTION_EDIT: 'edit preset item',
  COMMAND_PRESET_OPTION_UNSET: 'remove preset item',
  COMMAND_CONFIG: 'global config for code linter',
  COMMAND_CONFIG_LIST: 'display all existing configurations',
  COMMAND_CONFIG_GET: 'get configuration item',
  COMMAND_CONFIG_UNSET: 'remove configuration item',
}

const COMMON = {
  FEATURE_COMMIT: 'commit validate',
  FEATURE_FORMAT: 'code format',
  NO_DATA: 'no data found',
  SUCCESS_OPERATION: 'successfully operation',
  CANCEL_OPERATION: 'cancel operation',
  SUCCESS_DELETE: 'successfully delete',
  TIP_NOT_CHANGE: 'done nothing change for you code',
  TIP_INSTALL_LATER: 'manually copy the script and install later',
  TIP_ADD_INSTALL_DONE: 'successfully install dependencies',
  TIP_ADD_INSTALL_TIP: 'install dependencies via: ',
  TIP_ADD_DONE: 'code linter is now available inside your code',
  TIP_REMOVE_DONE: 'successfully remove code linter from your code'
}

const ADD = {
  ADD_FEATURES: 'add features',
  PROMPT_MANUAL_SELECT: 'manual select',
  PROMPT_CHOOSE_ADD_FEATURES: 'select features your want:',
  PROMPT_USE_PRESET: 'use a preset?',
  PROMPT_CONFIRM_ADD_FORMAT: 'confirm to add code format into your code?',
  PROMPT_CHOOSE_ENVIRONMENT: 'where does your code run on:',
  PROMPT_USE_TYPESCRIPT: 'use TypeScript ?',
  PROMPT_USE_VUE: 'use Vue framework ?',
  PROMPT_CHOOSE_CODE_STYLE_GUIDE: 'Select code style guide you want:',
  PROMPT_CONFIRM_ADD_COMMIT: 'confirm to add commit validate into your code?',
  PROMPT_SAVE_AS_PRESET: 'save current selections as a preset?',
  PROMPT_INSTALL_NOW: 'install dependencies now?',
  PROMPT_CHOOSE_PACKAGE_MANAGER: 'select a package manager:'
}

const REMOVE = {
  REMOVE_FEATURES: 'remove features',
  REMOVE_FEATURE_CONFIRM: 'confirm to remove features',
  PROMPT_CHOOSE_FEATURES: 'select linter features your want to remove',
}

const PRESET = {
  ADD_PRESET: 'add preset',
  PROMPT_TITLE_ADD: ' add preset ',
  EDIT_PRESET: 'edit preset',
  PROMPT_PRESET_NAME: 'input preset name:',
  PRESET_NAME: 'preset name',
  PRESET_NAME_RULE_REQUIRED: 'please input preset name',
  PRESET_NAME_RULE_LENGTH: 'preset name should have at least 3 characters',
  PROMPT_PRESET_DESCRIPTION: 'input preset description:',
  PRESET_DESCRIPTION: 'preset description',
  PRESET_DESCRIPTION_RULE_REQUIRED: 'please input preset description',
  PRESET_DESCRIPTION_RULE_LENGTH: 'preset description should have at least 3 characters',

  OPERATION_SUCCESS_EDIT: 'successfully edit preset',
  ERROR_NEED_NAME: 'need preset name when edit a preset',
  ERROR_PRESET_NOT_FOUND: 'not found such preset',
}

export default {
  USAGE,
  COMMON,
  ADD,
  REMOVE,
  PRESET
}
