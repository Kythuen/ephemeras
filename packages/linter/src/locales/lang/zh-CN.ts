const USAGE = {
  ROOT_OPTION_INITIAL: '初始化项目中的代码规范',
  ROOT_OPTION_CLEAR: '移除项目中的代码规范',
  ROOT_OPTION_PRESET: '使用预设快速配置项目的代码规范',
  COMMAND_INITIAL: '初始化项目中的代码规范',
  COMMAND_CLEAR: '移除项目中的代码规范',
  COMMAND_ADD: '添加指定代码规范, 可选特性: format, commit',
  COMMAND_REMOVE: '移除指定代码规范配置, 可选特性: format, commit',
  COMMAND_PRESET: '管理现有的预设配置',
  COMMAND_PRESET_OPTION_LIST: '列出所有的预设',
  COMMAND_PRESET_OPTION_ADD: '添加预设',
  COMMAND_PRESET_OPTION_EDIT: '编辑指定预设',
  COMMAND_PRESET_USAGE_OPTION_UNSET: '移除指定预设',
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
}

const TITLE = {
  USE_PRESET: '💬 是否使用预设:',
  ADD_FORMAT: '💬 添加代码格式化:',
  REMOVE_FORMAT: '💬 移除代码格式化:',
  ADD_COMMIT: '💬 添加代码提交校验:',
  REMOVE_COMMIT: '💬 移除代码提交校验:',
  ADD_PRESET: '💬 保存为预设:',
  INSTALL_DEPENDENCIES: '💬 安装依赖:',
  UNINSTALL_DEPENDENCIES: '💬 移除依赖:',
  INSTALL_LATER: '💬 复制脚本稍后安装:',
  PRESET_LIST: '💬 预设列表:',
  PRESET_ADD: '💬 添加预设:',
  PRESET_EDIT: '💬 编辑预设',
  CONFIG_LIST: '💬 全局配置列表:',
}

const PROMPT = {
  SELECT_PRESET: '选择一个预设:',
  SELECT_ADD_FEATURES: '选择你要的功能:',
  SELECT_ENVIRONMENT: '选择项目运行环境:',
  USE_TYPESCRIPT: '是否使用 TypeScript?',
  SELECT_FRAMEWORK: '选择一个前端开发框架:',
  SELECT_CODE_STYLE_GUIDE: '选择代码风格:',
  USE_COMMIT_VALIDATE: '是否开启代码提交校验',
  CHECK_COMMIT_MESSAGE: '是否规范化提交信息',
  SAVE_AS_PRESET: '保存当前配置为预设?',
  PRESET_NAME: '输入预设名称:',
  PRESET_DESCRIPTION: '输入预设描述:',
  INSTALL_NOW: '现在安装依赖?',
  SELECT_PACKAGE_MANAGER: '选择包管理器:',
  REMOVE_FORMAT: '确定移除代码格式化?',
  REMOVE_COMMIT: '确定移除代码提交校验?',
  REMOVE_UNINSTALL: '现在移除依赖?',
}

const TEXT = {
  FEATURE_COMMIT: '代码提交校验',
  FEATURE_FORMAT: '代码格式化',
  MANUAL_SELECT: '手动选择',
  PRESET_NAME: '预设名称',
  PRESET_DESCRIPTION: '预设描述',
}

const RULE = {
  PRESET_NAME_REQUIRED: '请输入预设名称',
  PRESET_NAME_LENGTH: '预设名称须大于3个字符',
  PRESET_DESCRIPTION_REQUIRED: '请输入预设描述',
  PRESET_DESCRIPTION_LENGTH: '预设描述须大于3个字符',
}

export default {
  USAGE,
  TIP,
  TITLE,
  PROMPT,
  TEXT,
  RULE
}
