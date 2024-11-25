# build

这里提供 Node 项目开发过程中一些常用的方法, 主要是项目环境判断和读取项目信息的一些方法。

## 使用方法

```ts
import {
  isProject,
  readPKG,
  getPackageManager,
  getPackageManagers,
  isPnpmWorkspaceRepo
} from '@ephemeras/utils'

// 判断项目是否为 npm 项目
const isNpmProject = isProject()

// 读取 package.json 文件的信息
const PKG = readPKG()

// 获取当前项目已有的包管理器
const currentPM = getPackageManager()

// 获取已安装的包管理器列表
const PMList = getPackageManagers()

// 判断项目是否为 pnpm workspace 项目
const isMonorepo = isPnpmWorkspaceRepo()
```

## isProject
判断当前目录是否是一个 npm 项目

`(): boolean`

## readPKG
读取 package.json 文件的信息，而无需在 tsconfig.json 中包含它

`(): object`

## getPackageManager
获取当前项目已有的包管理器，默认为 `npm`

`(): string`

## getPackageManagers
获取当前项目已有的包管理器，如`npm`, `yarn`, `pnpm`

`(): string[]`

## isPnpmWorkspaceRepo
判断项目是否为 pnpm workspace 项目

`(): boolean`