const USAGE = {
  ROOT_OPTION_INITIAL: 'init code lint into your code',
  ROOT_OPTION_CLEAR: 'remove code lint from your code',
  COMMAND_INITIAL: 'init code lint into your code',
  COMMAND_CLEAR: 'remove code lint from your code',
  COMMAND_ADD: 'add lint features into your code: [format, commit]',
  COMMAND_REMOVE: 'remove lint features from your code: [format, commit]',
  COMMAND_PRESET: 'manage presets for code linter',

  COMMAND_PRESET_OPTION_LIST: 'display all existing presets',
  COMMAND_PRESET_OPTION_ADD: 'add preset item',
  COMMAND_PRESET_OPTION_EDIT: 'edit preset item',
  COMMAND_PRESET_OPTION_UNSET: 'remove preset item',
  COMMAND_CONFIG: 'global config for code linter',
  COMMAND_CONFIG_LIST: 'display all existing configurations',
  COMMAND_CONFIG_GET: 'get configuration item',
  COMMAND_CONFIG_UNSET: 'remove configuration item'
}

const TIP = {
  WELCOME: '🚀 Welcome to Code Linter',
  SUCCESS_OPERATION: 'successfully operation',
  SUCCESS_DELETE: 'successfully delete',
  SUCCESS_ADD_DONE: '🎉 Code lint successfully add into your project',
  SUCCESS_REMOVE_DONE: 'Successfully remove code linter from your code',
  PROBLEM_FEEDBACK: 'Any problem?',
  NOT_CHANGE: 'do nothing to you code',
  NO_DATA: 'no data found',
  NEED_PRESET_NAME: '❌ need preset name',
  PRESET_NOT_FOUND: '❌ not found such preset',
  PRESET_ADD: 'successfully add preset',
  PRESET_EDIT: 'successfully edit preset',
  PRESET_DELETE: 'successfully delete preset',
  CANCEL_OPERATION: '❌ Cancel operation',
  CREATE_FILE: 'start create files...',
  REMOVE_FILE: 'start remove files...',
  ADD_DEPENDENCIES: 'start add dependencies...',
  REMOVE_DEPENDENCIES: 'start remove dependencies...',
  INSTALL_DEPENDENCIES: 'install dependencies...',
  UNINSTALL_DEPENDENCIES: 'uninstall dependencies...',
  INSTALL_DEPENDENCIES_SUCCESS: 'successfully install dependencies',
  UNINSTALL_DEPENDENCIES_SUCCESS: 'successfully uninstall dependencies'
}

const TITLE = {
  USE_PRESET: '💬 Use preset or not:',
  SELECT_FEATURES: '💬 Select features:',
  ADD_REQUIREMENT: '💬 Select requirement:',
  ADD_CONFIRM: '💬 Confirmation:',
  INSTALL_DEPENDENCIES: '💬 Install dependencies:',
  SAVE_AS_PRESET: '💬 Save as preset:',
  REMOVE_FORMAT: '💬 Remove code format:',
  REMOVE_COMMIT: '💬 Remove commit validate:',
  UNINSTALL_DEPENDENCIES: '💬 Uninstall dependencies:',
  PRESET_LIST: '💬 Preset list:',
  PRESET_ADD: '💬 Add preset:',
  PRESET_EDIT: '💬 Edit preset',
  CONFIG_LIST: '💬 Config list:'
}

const PROMPT = {
  SELECT_PRESET: 'use preset:',
  SELECT_FEATURES_ADD: 'select features your want:',
  SELECT_ENVIRONMENT: 'select code running environment:',
  USE_TYPESCRIPT: 'use typescript?',
  SELECT_FRAMEWORK: 'select frontend framework:',
  USE_COMMIT_VALIDATE: 'use commit hook validate?',
  USE_MESSAGE_CHECK: 'use commit message check?',
  CONFIRM_ADD_FEATURES: 'confirm to add lint features for your code?',
  SAVE_AS_PRESET: 'save current selections as a preset?',
  INSTALL_NOW: 'install dependencies now?',
  SELECT_PACKAGE_MANAGER: 'select a package manager:',
  PRESET_NAME: 'input preset name:',
  PRESET_DESCRIPTION: 'input preset description:',
  SELECT_FEATURES_REMOVE: 'select features your want to remove:',
  REMOVE_FORMAT: 'confirm to remove code format from your code?',
  REMOVE_COMMIT: 'confirm to remove commit validate from your code?',
  PROMPT_CONFIRM_REMOVE_FEATURES:
    'confirm to remove lint features for your code?',
  REMOVE_UNINSTALL: 'uninstall dependencies now?'
}

const TEXT = {
  MANUAL_SELECT: 'manual select',
  FEATURE_COMMIT: 'commit validate',
  FEATURE_FORMAT: 'code format',
  PRESET_NAME: 'preset name',
  PRESET_DESCRIPTION: 'preset description',
  ADD_PACKAGE: 'add package',
  ADD_FILE: 'add file',
  CREATE: 'create',
  REMOVE: 'remove',
  UPDATE: 'update'
}

const RULE = {
  PRESET_EXIST: 'preset already exist',
  FIELD_REQUIRED: 'please input {{field}}',
  FIELD_LENGTH: ' {{field}} should have at least 3 characters'
}

export default {
  USAGE,
  TIP,
  TITLE,
  PROMPT,
  TEXT,
  RULE
}
