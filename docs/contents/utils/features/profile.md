# profile

开发应用程序过程中，我们常常保存一些配置信息到指定文件夹，需要创建、更新、操作相应的配置文件。里面可能涉及到创建、读取、写入、删除文件等操作，又设计到配置数据的操作，比较繁琐。

这里提供一个操作配置文件的类 Profile, 用于快捷简单地操作配置文件。


## 使用方法

```ts
import { Profile } from '@ephemeras/utils'

const file = new Profile({
  path: 'xxx/setting.json'
})

// 获取配置文件的数据
console.log(file.getData())   // {}

// 获取配置文件的路径
console.log(file.getUrl())    // `~/xxx/setting.json`

// 更新某个属性
file.set('a', 'a string')     // { a: 'a string' }
file.set({ b: 0 })            // { a: 'a string', b: 0 }

// 获取某个属性
console.log(file.get('a')）   // 'a string'

// 删除某个属性
file.delete('a')              // { b: 0 }

// 清空配置文件的数据
file.clear()                  // {}

// 删除配置文件
file.remove()
```

## 详细说明

### 构造方法

`(options: ProfileOptions): Profile`

其中 [ProfileOptions](https://github.com/Kythuen/ephemeras/blob/main/packages/utils/dist/validate/index.d.ts) 的类型定义如下：
```ts
{
  path: string
  base?: string
  data?: ProfileData
  serializer?: ProfileSerializer
  transformer?: ProfileTransformer
}
```
| 参数名 | 参数类型 | 是否默认值 | 描述 | required |
| --- | --- | :---: | --- | :---: |
| path | string | - | 配置文件的保存路径 | Y |
| base | string | homedir | 配置文件的保存的文件夹 | N |
| data | [ProfileData](https://github.com/Kythuen/ephemeras/blob/main/packages/utils/src/profile/index.ts) | {} | 配置文件的初始数据 | N |
| serializer | [ProfileSerializer](https://github.com/Kythuen/ephemeras/blob/main/packages/utils/src/profile/index.ts) | - | 自定义序列化函数 | N |
| transformer | [ProfileTransformer](https://github.com/Kythuen/ephemeras/blob/main/packages/utils/src/profile/index.ts) | - | 自定义解析函数 | N |

### 自定义处理函数
默认的配置文件是 `.json` 格式，你也可以使用你自己定义的序列化及解析函数来操作配置文件。

@ephemeras/utils 提供了 `yaml`, `toml` 和 `ini` 格式的序列化及解析函数，需要的话也可以按需引入。

:::tip
使用 `yaml` 格式，请先安装依赖 `js-yaml`, `yaml` 和 `@types/js-yaml` 。

使用 `toml` 格式，请先安装依赖 `@iarna/toml` 。

使用 `ini` 格式，请先安装依赖 `ini` 和 `@types/ini` 。
```shell
## yaml 格式支持
pnpm add js-yaml@4.1.0 yaml@2.2.1
pnpm add -D @types/js-yaml@4.0.5

## toml 格式支持
pnpm add -D @iarna/toml@2.2.5

## ini 格式支持
pnpm add ini@4.1.0
pnpm add -D @types/ini@1.3.31
```
:::

使用举例: 
```ts
import { serializer, transformer } from '@ephemeras/utils/profile/format/toml'

const file = new Profile({
  path: 'xxx/setting.toml',
  serializer,
  transformer
})
```

### getData
获取配置文件的数据

`(): object`

### getUrl
获取配置文件的完整保存路径

`(): string`

### get
获取配置数据的某个属性

`(prop: string): any`

### set
设置配置数据的属性

`(prop: string, value: any): ProfileData`
`(data: ProfileData): ProfileData`

### delete
删除配置数据的某个属性

`(key: string): ProfileData`

### clear
清空配置文件的数据

`(): ProfileData`

### remove
删除配置文件

`(): void`

