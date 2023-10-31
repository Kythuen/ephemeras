const USAGE = {
  ROOT_OPTION_INITIAL: 'initial code linter into your code',
  ROOT_OPTION_CLEAR: 'remove code linter from your code',
  ROOT_OPTION_PRESET: 'use preset to initial code linter for your code',
  COMMAND_INITIAL: 'add code linter features into your code manually',
  COMMAND_CLEAR: 'remove code linter features from your code manually',
  COMMAND_ADD: 'add target features into your code: format, commit',
  COMMAND_REMOVE: 'remove target features from your code: format, commit',
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

const TIP = {
  WELCOME: '🚀 Welcome to Code Linter',
  SUCCESS_OPERATION: 'successfully operation',
  SUCCESS_DELETE: 'successfully delete',
  SUCCESS_ADD_DONE: '🎉 Code lint successfully add into your project',
  SUCCESS_REMOVE_DONE: 'Successfully remove code linter from your code',
  PROBLEM_FEEDBACK: 'Problem?',
  NOT_CHANGE: 'do nothing to you code',
  NO_DATA: 'no data found',
  NEED_PRESET_NAME: '❌ need preset name',
  PRESET_NOT_FOUND: '❌ not found such preset',
  PRESET_ADD: 'Successfully add preset',
  PRESET_EDIT: 'Successfully edit preset',
  PRESET_DELETE: 'Successfully delete preset',
  CANCEL_OPERATION: '❌ Cancel operation',
}

const TITLE = {
  USE_PRESET: '💬 Use preset or not:',
  ADD_FORMAT: '💬 Add code format:',
  REMOVE_FORMAT: '💬 Remove code format:',
  ADD_COMMIT: '💬 Add commit validate:',
  REMOVE_COMMIT: '💬 Remove commit validate:',
  ADD_PRESET: '💬 Save as preset:',
  INSTALL_DEPENDENCIES: '💬 Install dependencies:',
  UNINSTALL_DEPENDENCIES: '💬 Uninstall dependencies:',
  INSTALL_LATER: '💬 Copy the script bellow and install later:',
  PRESET_LIST: '💬 Preset list:',
  PRESET_ADD: '💬 Add preset:',
  PRESET_EDIT: '💬 Edit preset',
  CONFIG_LIST: '💬 Config list:',
}

const PROMPT = {
  SELECT_PRESET: 'select a preset:',
  SELECT_ADD_FEATURES: 'select features your want:',
  SELECT_ENVIRONMENT: 'where does your code run on:',
  USE_TYPESCRIPT: 'use TypeScript?',
  USE_VUE: 'use Vue framework?',
  SELECT_CODE_STYLE_GUIDE: 'select code style guide you want:',
  USE_COMMIT_VALIDATE: 'use commit hook validate',
  CHECK_COMMIT_MESSAGE: 'check commit message',
  SAVE_AS_PRESET: 'save current selections as a preset?',
  PRESET_NAME: 'input preset name:',
  PRESET_DESCRIPTION: 'input preset description:',
  INSTALL_NOW: 'install dependencies now?',
  SELECT_PACKAGE_MANAGER: 'select a package manager:',
  REMOVE_FORMAT: 'confirm to remove code format from your code?',
  REMOVE_COMMIT: 'confirm to remove commit validate from your code?',
  REMOVE_UNINSTALL: 'uninstall dependencies now?',
}

const TEXT = {
  FEATURE_COMMIT: 'commit validate',
  FEATURE_FORMAT: 'code format',
  MANUAL_SELECT: 'manual select',
  PRESET_NAME: 'preset name',
  PRESET_DESCRIPTION: 'preset description',
}

const RULE = {
  PRESET_NAME_REQUIRED: 'please input preset name',
  PRESET_NAME_LENGTH: 'preset name should have at least 3 characters',
  PRESET_DESCRIPTION_REQUIRED: 'please input preset description',
  PRESET_DESCRIPTION_LENGTH: 'preset description should have at least 3 characters',
}

export default {
  USAGE,
  TIP,
  TITLE,
  PROMPT,
  TEXT,
  RULE
}
