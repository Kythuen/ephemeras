import 'virtual:uno.css'
import type { Theme } from 'vitepress'
import { Theme as WBTheme } from '@white-block/vitepress'
import Layout from './Layout.vue'
import FunctionBlock from './components/global/FunctionBlock.vue'
import './styles/font.css'
import './styles/index.css'
import './styles/landing.css'

const theme: Theme = {
  extends: WBTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('FunctionBlock', FunctionBlock)
  }
}

export default theme
