import gradient from 'gradient-string'
import picocolors from 'picocolors'
import { $t } from '.'

const { bold } = picocolors
const { retro, vice } = gradient

export default {
  TIP_WELCOME: bold(retro($t('TIP.WELCOME'))),
  TIP_CANCEL_OPERATION: $t('TIP.CANCEL_OPERATION'),
  TIP_SUCCESS_ADD_DOCS: bold(vice($t('TIP.SUCCESS_ADD_DOCS'))),

  TITLE_INPUT_INFORMATION: bold($t('TITLE.INPUT_INFORMATION')),
  TITLE_CREATE_DOCUMENTS: bold($t('TITLE.CREATE_DOCUMENTS')),
  TITLE_INSTALL_DEPENDENCIES: bold($t('TITLE.INSTALL_DEPENDENCIES')),
  PROMPT_SITE_TITLE: bold($t('PROMPT.SITE_TITLE')),
  PROMPT_SITE_SLOGAN: bold($t('PROMPT.SITE_SLOGAN')),
  PROMPT_GET_REPO: bold($t('PROMPT.GET_REPO')),

  RULE_SITE_TITLE: $t('RULE.REQUIRED', { field: 'site title' }),
  RULE_SITE_SLOGAN: $t('RULE.REQUIRED', { field: 'site slogan' }),
  RULE_GET_REPO: $t('RULE.REQUIRED', { field: 'git repo' }),
  RULE_SITE_TITLE_LENGTH: $t('RULE.LENGTH', { field: 'site title', length: 3 }),
  RULE_SITE_SLOGAN_LENGTH: $t('RULE.LENGTH', {
    field: 'site slogan',
    length: 3
  }),
  RULE_GET_REPO_LENGTH: $t('RULE.LENGTH', { field: 'git repo', length: 3 })
}
