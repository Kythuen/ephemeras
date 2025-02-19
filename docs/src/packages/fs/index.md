---
title: '@ephemeras/fs'
description: File System Operation Library for Node.js.
---

## Installation

::: code-group
```sh [pnpm]
pnpm add @ephemeras/fs -D 
```
```sh [npm]
npm install @ephemeras/fs --save-dev
```
```sh [yarn]
yarn add @ephemeras/fs -D 
```
:::


## Usage

```ts
import { ensureDir, copyDir } from '@ephemeras/fs'

const ensure = await ensureDir('foo/bar')

const { src, dest, add, update, skip } = await copyDir('/foo/bar', '/foo/baz')
```
