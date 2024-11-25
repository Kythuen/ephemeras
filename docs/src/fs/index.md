---
title: File System
description: Supset of <code>node:fs/promise</code> that provided more convenient features.
---


![](https://img.shields.io/codecov/c/github/Kythuen/ephemeras?flag=fs)

## Introduce
![Graph](https://picsum.photos/1200/200/?random)

## Usage

### unixPath
<FunctionBlock
  :options="{
    desc: 'Determine path exists or not.',
    type: '(path: string): Promise<boolean>',
    params: [
      {
        name: 'path',
        type: 'string',
        desc: 'The path you want to determine.'
      },
      {
        name: 'path',
        type: 'string',
        desc: 'The path you want to determine.'
      }
    ],
    returns: 'Unix format path.'
  }"
/>

Example
```ts
unixPath('abc/ab/c')        //--> 'abc/ab/c'
unixPath('abc\\ab\\c')      //--> 'abc/ab/c'
```

:::tip
Some special tip
:::