import type { ConfigResolver } from '../../resolver'
import {
  formatBase,
  formatTypescript,
  formatVue,
  formatFinal
} from '../../resolver'

export default async function (resolver: ConfigResolver) {
  resolver.use(formatBase, { environment: ['browser', 'node'] })
  resolver.use(formatTypescript, { environment: ['browser', 'node'] })
  resolver.use(formatVue, {})
  resolver.use(formatFinal, {})
}
