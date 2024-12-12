---
title: Getting Started
description: Parser template files with data.
---
<!-- 
## Preview
![preview](/vitepress/preview.png)

[Online Demo](https://kythuen.github.io/white-block/) -->

## Installation

::: code-group
```sh [pnpm]
pnpm add @ephemeras/parser -D 
```
```sh [npm]
npm install @ephemeras/parser --save-dev
```
```sh [yarn]
yarn add @ephemeras/parser -D 
```
:::

## Usage

```ts
import { Parser, prettier } from '@ephemeras/parser'

const parser = new Parser({
  source: TEST_DIR_SRC,
  destination: TEST_DIR_DEST
})

const { src, dest, add, update, skip } = await parser.build()
```

## Parser
To use `Parser`, you can easily to parse a template project. 

### Options
| Option | Type | Description | 
| ---- | ---- | ---- |
| source | string | Source directory. |
| destination | string | Destination directory. |
| clean | boolean | Clear destination directory or not before operation. |
| overwrite | boolean | Overwrite existing file or directory. |
| plugins | ParserPlugin[] | Parser plugins. See plugins support. |
| context | string | Context directory. |
| relativize | boolean | Relativize the paths in result. |
| includes | string[] | Pattern matcher to include for operation. |
| excludes | string[] | Pattern matcher to exclude for operation. |
| filter | (src: string) => boolean | Filter by some condition for operation.\nreturn `true` to continue operation and `false` to skip it. |
| beforeEach | (src: string, dest: string) => any | Hook before each item been operated. |
| afterEach | (src: string, dest: string) => any | Hook after each item been operated. |

### Result
| value | Type | Description | 
| ---- | ---- | ---- |
| src | string[] | Leaf items of source directory. |
| dest | string[] | Leaf items of destination directory. |
| add | string[] | Items which new add into destination directory. |
| update | string[] | Items which been overwrite in destination directory. |
| skip | string[] | Items which been skip in source directory. |


## FileParser
Sometimes, you only want to parse a single file, you can use `Parser` with options `includes` to filter the file wanted. Also we provide `FileParser` to do this directly.

### Options
| Option | Type | Description | 
| ---- | ---- | ---- |
| source | string | Source file. |
| destination | string | Destination file. |
| plugins | ParserPlugin[] | Parser plugins. See plugins support. |
| context | string | Context directory. |
| overwrite | boolean | Overwrite existing file or directory. |
<!-- ## Usage

### Extend Default Theme

If you already have a vitepress docs project, do follow steps to take WhiteBlock theme into your docs. 

#### Edit vitepress theme
::: code-group
```ts [.vitepress/theme.ts]
import 'virtual:uno.css'
import DefaultTheme from 'vitepress/theme'
import { Layout } from '@white-block/vitepress'

export default {
  extends: DefaultTheme,
  Layout
}
```
:::

#### Add unocss config file
::: code-group
```ts [uno.config.ts]
import { UnocssConfig } from '@white-block/vitepress/unocss'

export default UnocssConfig()

```
:::

#### Add vite config file
::: code-group
```ts [vite.config.ts]
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [UnoCSS()]
})

```
:::

#### Edit vitepress config
::: code-group
```ts [.vitepress/config.ts]
import { defineConfig } from 'vitepress'

export default defineConfig({
  // ...other configs,
  vite: {
    configFile: 'vite.config.ts'
  }
})

```
:::

### Create with CLI
Also, you can CLI tool provided, quick create a new vitepress project with WhiteBlock theme.

::: code-group
```sh [pnpm]
pnpm dlx wb-vitepress init
```
```sh [npm]
npx wb-vitepress init
```
```sh [yarn]
yarn dlx wb-vitepress init
```
:::

## Customize 

If `@white-block/vitepress` can meet most of your needs, but you want to customize some parts. There also some ways provided for you to customize your documents in more detailed places.

### Layout

[Layouts](./layout)

### Layout Slots

[Layout Slots](./slots) -->