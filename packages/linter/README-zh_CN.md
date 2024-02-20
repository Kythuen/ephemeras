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


简体中文 | [English](./README.md)


## 项目简介
在日常开发过程中，我们经常要去搭建各种项目，开源的或者企业内部项目。这些项目通常需要一定的质量和规范化要求。比如需要：代码格式化、统一的代码风格、规范化的提交信息 代码提交校验控制等。

常见的解决方案是：
- 使用 prettier + eslint 处理代码格式化、统一代码风格，一定程度保证代码的质量。
- 使用 husky + commitlint + lint-staged 处理提交信息规范化控制和提交校验控制。

这些项目中代码质量和规范化的控制的需求基本类似的，但是整个配置过程相对繁琐，需要熟练安装各个依赖，添加各种配置文件，甚至还需要确保依赖版本间的对应关系。

`@ephemeras/linter` 是一个命令行的工具，用于快捷配置项目的代码质量及规范化。它通过交互式问答的方式，聚焦项目中真正的具体代码质量及规范化需求，而隐去了安装各个依赖，创建配置文件的相关过程，使用方便快捷，逻辑清晰。

`@ephemeras/linter` 功能齐全、使用方便。支持全量，部分加入功能特性，还提供了相应功能特性的移除操作。提供了预设保存的功能，用户同类型项目的快捷配置。支持中文及英文模式。

详细的使用方法，可查看 [在线文档](https://kythuen.github.io/ephemeras/linter) 。


## 使用效果
### 初始化项目中的代码规范
![init](https://kythuen.github.io/ephemeras/linter/init.gif)

### 添加指定代码规范
可选功能特性: `format`, `commit`
![add](https://kythuen.github.io/ephemeras/linter/add.gif)

### 移除项目中的代码规范
![clear](https://kythuen.github.io/ephemeras/linter/clear.gif)

### 移除指定代码规范配置
可选功能特性: `format`, `commit`
![remove](https://kythuen.github.io/ephemeras/linter/remove.gif)

### 管理现有的预设配置
![preset](https://kythuen.github.io/ephemeras/linter/preset.gif)

### 全局配置管理
![config](https://kythuen.github.io/ephemeras/linter/config.gif)


## 常见问题
### 在 Vue 项目中使用
#### 问题：找不到模块“*.vue”或其相应的类型声明
![declare](https://kythuen.github.io/ephemeras/linter/qa_vue.png)
#### 解答：增加模块声明
```ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const vueComponent: DefineComponent<{}, {}, any>
  export default vueComponent
}
```
### 在 React 项目中使用
#### 问题：vite 项目中的 alias 配置 eslint 报异常
![alias](https://kythuen.github.io/ephemeras/linter/qa_react.png)
#### 解答：.eslintrc 文件中增加 settings 配置
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

## 生成 changelog
```shell
$ pnpm install -g conventional-changelog-cli
$ cd my-project
$ conventional-changelog -p angular -i CHANGELOG.md -s
```
[查看更多使用方法](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)

## 更多工具
- [@ephemeras/linter](https://kythuen.github.io/ephemeras/linter/) - 方便的代码质量控制工具，快速配置完成项目的代码规范化搭建。
- [@ephemeras/utils](https://kythuen.github.io/ephemeras/utils/) - 工具集，提供各种前端构建中常用的功能，高效开发、质量可靠。