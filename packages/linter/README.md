<p align="center">
  <br>
  <a href="https://github.com/Kythuen/ephemeras">
    <img src="https://raw.githubusercontent.com/Kythuen/ephemeras/main/docs/contents/public/logo.png" alt="Make development easier and more efficient" width="300">
  </a>
</p>
<h3 align="center">@ephemeras/linter</h3>
<br>

<p align="center">
  <a href="https://www.npmjs.com/package/@ephemeras/linter" target="__blank">
    <img alt="NPM version" src="https://img.shields.io/npm/v/@ephemeras/linter?color=a1b858">
  </a>
  <a href="https://github.com/Kythuen/ephemeras/blob/main/LICENSE" target="__blank">
    <img alt="License" src="https://img.shields.io/npm/l/@ephemeras/linter" >
  </a>
  <a href="https://github.com/Kythuen/white-block/actions/workflows/test.yml" target="__blank">
    <img src="https://github.com/Kythuen/white-block/actions/workflows/test.yml/badge.svg" alt="test">
  </a>
  <a href="https://github.com/Kythuen/ephemeras/actions/workflows/release.yml" target="__blank">
    <img alt="Release workflow" src="https://img.shields.io/github/actions/workflow/status/Kythuen/ephemeras/release.yml">
  </a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/~ephemeras">
    <img src="https://img.shields.io/badge/NPM-CB3837.svg?logo=npm&logoColor=white" alt="NPM">
  </a>
  <a href="https://juejin.cn/user/3526835391969069/posts">
    <img src="https://img.shields.io/badge/稀土掘金-007FFF.svg?logo=juejin&logoColor=white" alt="稀土掘金">
  </a>
  <a href="https://github.com/Kythuen/ephemeras" target="__blank">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/Kythuen/ephemeras?style=social">
  </a>
</p>

<br>

English | [简体中文](./README-zh_CN.md)


## Introduction

When daily development, we often need to build various projects, open source or enterprise projects. These projects typically require certain quality and standardization requirements. For example, it requires: code formatting, code style, standardized submission information, code submission verification control, etc.

Common solutions are:
- Use prettier + eslint to format and unify code styles.
- Use husky + commitlint + lint-staged to control submission information and run verification control on submission.

Code quality and standardized control for these projects are similar. The problem is that configure of them indeed cumbersome, for example you need to installing various dependencies, adding various configuration files, and you even need to ensure the correspondence versions between dependencies you installed.


`@ephemeras/linter` is a command-line tool used to quickly configure the code quality and standardization of projects. It focuses on the actual specific code quality and standardization requirements in the project through interactive Q&A, while hiding the process of installing various dependencies and creating configuration files. Easily to use and has clearly logic.

`@ephemeras/linter`is fully functional and easy to use. Supports full and partial addition of functional features, and also provides removal operations for corresponding functional features. Provides the function of preset saving, allowing users to quickly configure projects of the same type. Supports both Chinese and English modes.

For more details, Read [online documentation](https://kythuen.github.io/ephemeras/linter).


## Usage
### add code linter features into your code manually
![init](https://kythuen.github.io/ephemeras/linter/init.gif)

### add target features into your code
available features: `format`, `commit`
![add](https://kythuen.github.io/ephemeras/linter/add.gif)

### remove code linter features from your code manually
![clear](https://kythuen.github.io/ephemeras/linter/clear.gif)

### remove target features from your code
available features: `format`, `commit`
![remove](https://kythuen.github.io/ephemeras/linter/remove.gif)

### presets for code linter
![preset](https://kythuen.github.io/ephemeras/linter/preset.gif)

### global config for code linter
![config](https://kythuen.github.io/ephemeras/linter/config.gif)

## Questions
### in Vue project
#### Q：No Vue file declaration detected
![declare](https://kythuen.github.io/ephemeras/linter/qa_vue.png)
#### A：add declaration in `vite-env.d.ts` file
```ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const vueComponent: DefineComponent<{}, {}, any>
  export default vueComponent
}
```
### in React project
#### Q：Unable to resolve path to module '@/*' (.eslintimport/no-unresolved)
![alias](https://kythuen.github.io/ephemeras/linter/qa_react.png)
#### A：add settings in `.eslintrc` file
```json
{
  // ...
  "settings": {
    "typescript": {
      "project": "./tsconfig.json"
    },
    "import/resolver": {
      "alias": {
        "map": [["@", "./src"]],
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
}
```

## create changelog document
```shell
$ pnpm install -g conventional-changelog-cli
$ cd my-project
$ conventional-changelog -p angular -i CHANGELOG.md -s
```
[More usage](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)

## Relative
- [@ephemeras/linter](https://kythuen.github.io/ephemeras/linter/) - Command line tool, quickly configuring and completing project code standardization construction.
- [@ephemeras/utils](https://kythuen.github.io/ephemeras/utils/) - Tool collections provide useful features for front-end building, efficient and reliable.
