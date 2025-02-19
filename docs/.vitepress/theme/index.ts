import { Theme as WBTheme } from '@white-block/vitepress'
import 'virtual:group-icons.css'
import 'virtual:uno.css'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import './styles/index.less'

const theme: Theme = {
  extends: WBTheme,
  Layout
  // enhanceApp({ app }) {
  // }
}

export default theme
