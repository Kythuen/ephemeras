import { Parser, nunjucks } from '../src'

const parser = new Parser({
  source: '.',
  destination: '../test2'
})
parser.set('clean', true)
parser.use(nunjucks({ data: { data: '111' } }))

await parser.build()
