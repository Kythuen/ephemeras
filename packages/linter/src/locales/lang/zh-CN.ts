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

const COMMON = {
  FEATURE_COMMIT: '提交校验',
  FEATURE_FORMAT: '代码格式化',
  NO_DATA: '没有数据',
  SUCCESS_OPERATION: '操作成功',
  CANCEL_OPERATION: '操作取消',
  SUCCESS_DELETE: '删除成功',
  TIP_NOT_CHANGE: '代码无变更',
  TIP_INSTALL_LATER: '手动复制脚本以便稍后安装依赖',
  TIP_ADD_INSTALL_DONE: '依赖安装完成',
  TIP_ADD_INSTALL_TIP: '安装依赖通过: ',
  TIP_ADD_DONE: '已成功添加代码规范化配置',
  TIP_REMOVE_DONE: '已成功移除代码规范化配置'
}

const ADD = {
  ADD_FEATURES: '添加功能',
  PROMPT_MANUAL_SELECT: '手动选择',
  PROMPT_CHOOSE_ADD_FEATURES: '选择你要的特性:',
  PROMPT_USE_PRESET: '是否使用预设快速配置?',
  PROMPT_CONFIRM_ADD_FORMAT: '确认添加代码格式化特性?',
  PROMPT_CHOOSE_ENVIRONMENT: '选择项目运行环境:',
  PROMPT_USE_TYPESCRIPT: '是否使用 TypeScript ?',
  PROMPT_USE_VUE: '是否使用 Vue 框架?',
  PROMPT_CHOOSE_CODE_STYLE_GUIDE: '选择代码风格:',
  PROMPT_CONFIRM_ADD_COMMIT: '确认添加规范化提交特性?',
  PROMPT_SAVE_AS_PRESET: '是否保存为预设?',
  PROMPT_INSTALL_NOW: '现在安装依赖?',
  PROMPT_CHOOSE_PACKAGE_MANAGER: '选择包管理器:'
}

const REMOVE = {
  REMOVE_FEATURES: '移除功能',
  REMOVE_FEATURE_CONFIRM: '确定移除功能',
  PROMPT_CHOOSE_FEATURES: '选择要已移除的功能:'
}

const PRESET = {
  ADD_PRESET: '添加预设',
  PROMPT_TITLE_ADD: ' 添加预设 ',
  EDIT_PRESET: '编辑预设',
  PROMPT_PRESET_NAME: '输入预设名称:',
  PRESET_NAME: '预设名称',
  PRESET_NAME_RULE_REQUIRED: '请输入预设名称',
  PRESET_NAME_RULE_LENGTH: '预设名称须大于3个字符.',
  PROMPT_PRESET_DESCRIPTION: '输入预设描述:',
  PRESET_DESCRIPTION: '预设描述',
  PRESET_DESCRIPTION_RULE_REQUIRED: '请输入预设描述',
  PRESET_DESCRIPTION_RULE_LENGTH: '预设描述须大于3个字符',

  OPERATION_SUCCESS_EDIT: '编辑预设成功',
  ERROR_NEED_NAME: '编辑时需要指定预设',
  ERROR_PRESET_NOT_FOUND: '没有找到指定预设'
}

export default {
  USAGE,
  COMMON,
  ADD,
  REMOVE,
  PRESET
}
