---
title: Plugins
description: Plugins for template parser.
---

### Nunjucks

[Nunjucks](https://mozilla.github.io/nunjucks/) is a rich and powerful templating language for JavaScript. To use `nunjucks` plugins in Parser, you can easily to compiler a project template with data.

#### Types
`(data: Record<string, any> = {}, options?: Partial<PluginOptions>) => void`

#### Usage
```ts
import { Parser, nunjucks } from '@ephemeras/parser'

const parser = new Parser({
  source: TEST_DIR_SRC,
  destination: TEST_DIR_DEST
})
parser.use(nunjucks({ name: 'file1', content: 'content text' }))

const { src, dest, add, update, skip } = await parser.build()
```
### PluginOptions
| Option | Type | Description | 
| ---- | ---- | ---- |
| includes | string[] | Pattern matcher to include for operation. |
| excludes | string[] | Pattern matcher to exclude for operation. |
| filter | (src: string) => boolean | Filter by some condition for operation.\nreturn `true` to continue operation and `false` to skip it. |

### Prettier
[Prettier](https://prettier.io/) is a popular code formatter that aims to automate and enforce consistent code styling across JavaScript, TypeScript, Flow, CSS, SCSS, Less, HTML, JSON, Markdown, YAML, and other file types. 

#### Types
`(options?: Partial<PluginOptions>) => Promise<void>`

#### Usage
```ts
import { Parser, prettier } from '@ephemeras/parser'

const parser = new Parser({
  source: TEST_DIR_SRC,
  destination: TEST_DIR_DEST
})
parser.use(prettier())

const { src, dest, add, update, skip } = await parser.build()
```

### PluginOptions
| Option | Type | Description | 
| ---- | ---- | ---- |
| includes | string[] | Pattern matcher to include for operation. |
| excludes | string[] | Pattern matcher to exclude for operation. |
| filter | (src: string) => boolean | Filter by some condition for operation.<br>Return `true` to continue operation and `false` to skip it. |
| parsers | ParserMap | Prettier `extension-parser` map for files. |
| prettier | Record<string, any> | Prettier options. |