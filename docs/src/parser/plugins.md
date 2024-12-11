---
title: Plugins
description: Plugins for template parser.
---

### Nunjucks

[Nunjucks](https://mozilla.github.io/nunjucks/) is a rich and powerful templating language for JavaScript. To use `nunjucks` plugins in Parser, you can easily to compiler a project template with data.

```ts
import { Parser, nunjucks } from '@ephemeras/parser'

const parser = new Parser({
  source: TEST_DIR_SRC,
  destination: TEST_DIR_DEST
})
parser.use(nunjucks({ data: { name: 'file1', content: 'content text' } }))

const { src, dest, add, update, skip } = await parser.build()
```

### Prettier
[Prettier](https://prettier.io/) is a popular code formatter that aims to automate and enforce consistent code styling across JavaScript, TypeScript, Flow, CSS, SCSS, Less, HTML, JSON, Markdown, YAML, and other file types. 

```ts
import { Parser, prettier } from '@ephemeras/parser'

const parser = new Parser({
  source: TEST_DIR_SRC,
  destination: TEST_DIR_DEST
})
parser.use(prettier())

const { src, dest, add, update, skip } = await parser.build()
```