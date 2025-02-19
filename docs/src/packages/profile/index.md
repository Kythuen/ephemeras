---
title: '@ephemeras/profile'
description: Profile manager for ephemeras.
---

## Installation

::: code-group
```sh [pnpm]
pnpm add @ephemeras/profile -D 
```
```sh [npm]
npm install @ephemeras/profile --save-dev
```
```sh [yarn]
yarn add @ephemeras/profile -D 
```
:::

## Usage

```ts
import { Profile } from '@ephemeras/profile'

const file = new Profile({ path: '.white-block/cli/config.json' })

file.getUrl()       // get file path
file.getData()      // get file data
file.get(a.b)       // get data by propName
file.set({ a: 1 })  // set data by object
file.set(a.0, data) // set data by propName
file.delete(a.0)    // delete data by propName
file.clear()        // clear file data
file.remove()       // remove file
```