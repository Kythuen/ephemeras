# config

有时候我们编写 Node 项目时需要自己定义项目配置文件或者加载读取某些配置文件，类似 `vite.config.ts`, `uno.config.ts`。

## 使用方法

```ts
import { defineConfig } from '@ephemeras/utils'

export defineConfig({
  a: 1,
  b: 2
})
```

```ts
import { loadConfig } from '@ephemeras/utils'

const configs = loadConfig('vite.config.ts', {
  context: '.'
})
```

## 详细说明
