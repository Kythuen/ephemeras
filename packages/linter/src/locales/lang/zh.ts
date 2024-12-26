const USAGE = {
  ROOT_OPTION_INITIAL: '初始化项目代码规范',
  ROOT_OPTION_CLEAR: '移除项目代码规范',
  COMMAND_INITIAL: '初始化项目代码规范',
  COMMAND_CLEAR: '移除项目代码规范',
  COMMAND_ADD: '添加代码规范特性, 可选: format, commit',
  COMMAND_REMOVE: '移除代码规范特性, 可选: format, commit',
  COMMAND_PRESET: '管理现有预设配置',
  COMMAND_PRESET_OPTION_LIST: '列出所有的预设',
  COMMAND_PRESET_OPTION_ADD: '添加预设',
  COMMAND_PRESET_OPTION_EDIT: '编辑指定预设',
  COMMAND_PRESET_OPTION_UNSET: '移除指定预设',
  COMMAND_CONFIG: '全局配置管理',
  COMMAND_CONFIG_LIST: '列出所有的全局配置项',
  COMMAND_CONFIG_GET: '获取指定配置项',
  COMMAND_CONFIG_UNSET: '移除指定配置项'
}

const TIP = {
  WELCOME: '🚀 欢迎使用 Code Linter',
  SUCCESS_OPERATION: '操作成功',
  SUCCESS_DELETE: '删除成功',
  SUCCESS_ADD_DONE: '🎉 已成功添加代码规范化配置',
  SUCCESS_REMOVE_DONE: '已成功移除代码规范化配置',
  PROBLEM_FEEDBACK: '遇到问题?',
  NOT_CHANGE: '无操作变更',
  NO_DATA: '没有数据',
  NEED_PRESET_NAME: '❌ 需要指定预设名称',
  PRESET_NOT_FOUND: '❌ 没有找到指定预设',
  PRESET_ADD: '添加预设成功',
  PRESET_EDIT: '编辑预设成功',
  PRESET_DELETE: '删除预设成功',
  CANCEL_OPERATION: '❌ 操作取消',
  CREATE_FILE: '开始创建文件...',
  REMOVE_FILE: '开始移除文件...',
  ADD_DEPENDENCIES: '开始添加依赖...',
  REMOVE_DEPENDENCIES: '开始移除依赖...',
  INSTALL_DEPENDENCIES: '安装依赖...',
  UNINSTALL_DEPENDENCIES: '移除依赖...',
  INSTALL_DEPENDENCIES_SUCCESS: '安装依赖成功',
  UNINSTALL_DEPENDENCIES_SUCCESS: '移除依赖成功'
}

const TITLE = {
  USE_PRESET: '💬 是否使用预设:',
  SELECT_FEATURES: '💬 选择需要的特性:',
  ADD_REQUIREMENT: '💬 详细描述你的需求:',
  ADD_CONFIRM: '💬 确认:',
  INSTALL_DEPENDENCIES: '💬 安装依赖:',
  SAVE_AS_PRESET: '💬 保存为预设:',
  REMOVE_FORMAT: '💬 移除代码格式化:',
  REMOVE_COMMIT: '💬 移除代码提交校验:',
  UNINSTALL_DEPENDENCIES: '💬 移除依赖:',
  PRESET_LIST: '💬 预设列表:',
  PRESET_ADD: '💬 添加预设:',
  PRESET_EDIT: '💬 编辑预设',
  CONFIG_LIST: '💬 全局配置列表:'
}

const PROMPT = {
  SELECT_PRESET: '选择一个预设:',
  SELECT_FEATURES_ADD: '选择你要的功能:',
  SELECT_ENVIRONMENT: '选择项目运行环境:',
  USE_TYPESCRIPT: '是否使用 TypeScript?',
  SELECT_FRAMEWORK: '选择一个前端开发框架:',
  USE_COMMIT_VALIDATE: '是否开启代码提交校验?',
  USE_MESSAGE_CHECK: '是否开启代码提交信息校验?',
  CONFIRM_ADD_FEATURES: '确定为项目添加上述功能特性?',
  SAVE_AS_PRESET: '保存当前配置为预设?',
  INSTALL_NOW: '现在安装依赖?',
  SELECT_PACKAGE_MANAGER: '选择包管理器:',
  PRESET_NAME: '输入预设名称:',
  PRESET_DESCRIPTION: '输入预设描述:',
  SELECT_FEATURES_REMOVE: '选择要移除的功能特性:',
  REMOVE_FORMAT: '确定移除代码格式化?',
  REMOVE_COMMIT: '确定移除代码提交校验?',
  PROMPT_CONFIRM_REMOVE_FEATURES: '确定移除上述功能特性?',
  REMOVE_UNINSTALL: '现在移除依赖?'
}

const TEXT = {
  MANUAL_SELECT: '手动选择',
  FEATURE_COMMIT: '代码提交校验',
  FEATURE_FORMAT: '代码格式化',
  PRESET_NAME: '预设名称',
  PRESET_DESCRIPTION: '预设描述',
  ADD_PACKAGE: '新增依赖',
  ADD_FILE: '新增文件',
  CREATE: '创建',
  REMOVE: '删除',
  UPDATE: '更新'
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
