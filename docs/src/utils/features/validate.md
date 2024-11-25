# validate

TypeScript 为我们的代码提供了类型检查，让我们在开发阶段发现问题，但是我们的代码最终还是编译成 JavaScript 。在某些特定的场景，比如写入文件，我们传入的数据不对，可能会对文件数据造成损害，又或者文件保存成功，暂时没有问题，但是在使用时发现数据不对。

所以在某些严格场景下，我们需要对函数的参数做校验，校验不通过，则后续涉及的较危险操作就不去做，确保数据的安全。

@ephemeras/utils 选用了社区比较成熟的参数校验方案: [`joi`](https://joi.dev/) 。并且做了封装，使之更易使用。提供了校验单个和多个参数的功能。 

## 使用方法

```ts
import { validateParam, validateParams, joi } from '@ephemeras/utils'

// 校验单个参数
validateParam('name', 'nameValue', joi.string())

// 校验多个参数
validateParams([
  {
    name: 'a',
    schema: joi.string(),
    value: 'a string'
  },
  {
    name: 'b',
    schema: joi.number(),
    value: 0
  }
])
```

## 详细说明

### validateParam
校验单个参数

`(name: string, value: any, schema: AnySchema): boolean`
| 参数名 | 参数类型 | 是否默认值 | 描述 | required |
| --- | --- | :---: | --- | :---: |
| name | string | - | 要校验参数的名称 | Y |
| value | string | - | 要校验参数的值 | Y |
| schema | [AnySchema](https://github.com/hapijs/joi/blob/master/lib/index.d.ts) | - | `joi` 的 schema 定义，用来校验参数的值 | Y |

### validateParams
校验多个参数

`(options: ValidateParamsOptionsItem[]): boolean`
| 参数名 | 参数类型 | 是否默认值 | 描述 | required |
| --- | --- | :---: | --- | :---: |
| options | ValidateParamsOptionsItem[] | - | 要校验的参数列表 | Y |

其中 [ValidateParamsOptionsItem](https://github.com/Kythuen/ephemeras/blob/main/packages/utils/dist/validate/index.d.ts) 的类型定义如下：
```ts
{
  name: string
  value: any
  schema: AnySchema
}
```