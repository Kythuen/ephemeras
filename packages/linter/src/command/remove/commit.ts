import type { ConfigResolver } from '../../resolver'
import { commitBase } from '../../resolver'

export default async function (resolver: ConfigResolver) {
  resolver.use(commitBase, { environment: ['browser', 'node'] })
}
