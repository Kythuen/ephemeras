---
title: Functions
description: Functions list follows.
---

<!-- :::tip
Some special tip
::: -->

### unixPath
<FunctionBlock
  :options="{
    desc: 'Determine path exists or not.',
    type: '(path: string): string',
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

```ts
unixPath('abc/ab/c')        //--> 'abc/ab/c'
unixPath('abc\\ab\\c')      //--> 'abc/ab/c'
```
<!-- <hr /> -->

### relativePath
<FunctionBlock
  :options="{
    desc: 'Get relative path from base path.',
    type: '(path: string, base?: string): string',
    params: [
      {
        name: 'path',
        type: 'string',
        desc: 'Source path.'
      },
      {
        name: 'base',
        type: 'string',
        desc: 'Base path.'
      }
    ],
    returns: 'Relative path from base.'
  }"
/>

```ts
relativePath('/abc/b/1.txt', '/abc')      //--> 'b/1.txt'
relativePath('/abc/b/1.txt', 'abc\\b')    //--> '1.txt'
```

### getLeafs
<FunctionBlock
  :options="{
    desc: 'Get leaf items of directory.',
    type: '(path: string, options?: Partial<GetLeafsOptions>): string[]',
    params: [
      {
        name: 'path',
        type: 'string',
        desc: 'Source path.'
      },
      {
        name: 'options',
        type: 'GetLeafsOptions',
        desc: 'Options of operation.',
        url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/common.ts#L41'
      }
    ],
    returns: 'Leaf items list of the directory.'
  }"
/>

```ts
getLeafs('/foo/bar')      //--> ['/xxx', '1.txt', 'sub1/1.txt', ...]
```

### stat
<FunctionBlock
  :options="{
    desc: 'Get path stat information.',
    type: '(path: string, options?: Partial<StatOptions>): Promise<Stats>',
    params: [
      {
        name: 'path',
        type: 'string',
        desc: 'Path to check.'
      },
      {
        name: 'options',
        type: 'StatOptions',
        desc: 'Options of operation.',
        url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/stat.ts#L6'
      }
    ],
    returns: 'Stat info of path.'
  }"
/>

```ts
(await stat('foo/bar')).isFile()      //--> false
```

### exist
<FunctionBlock
  :options="{
    desc: 'Determine path exist or not.',
    type: '(path: string): Promise<boolean>',
    params: [
      {
        name: 'path',
        type: 'string',
        desc: 'Path to determine.'
      }
    ],
    returns: 'Path exist or not.'
  }"
/>

```ts
await exist('foo/bar')        //--> false
```

### ensureDir
<FunctionBlock
  :options="{
    desc: 'Create directory if not existing.',
    type: '(path: string, options?: Partial<EnsureDirOptions>): Promise<boolean>',
    params: [
      {
        name: 'path',
        type: 'string',
        desc: 'Directory path.'
      },
      {
        name: 'options',
        type: 'EnsureDirOptions',
        desc: 'Options of operation.',
        url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/ensure.ts#L7'
      }
    ],
    returns: 'Result of operation.'
  }"
/>

```ts
await ensureDir('foo/bar')
```

### ensureFile
<FunctionBlock
  :options="{
    desc: 'Create file if not existing.',
    type: '(path: string, content?: string, options?: Partial<EnsureFileOptions>): Promise<boolean>',
    params: [
      {
        name: 'path',
        type: 'string',
        desc: 'File path.'
      },
      {
        name: 'content',
        type: 'string',
        desc: 'Default content when create not exist file.',
      },
      {
        name: 'options',
        type: 'EnsureFileOptions',
        desc: 'Options of operation.',
        url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/ensure.ts#L33'
      }
    ],
    returns: 'Result of operation.'
  }"
/>

```ts
await ensureFile('foo/bar.json', JSON.stringify({ a: 1 }))
```

### readJSON
<FunctionBlock
  :options="{
    desc: 'Read a JSON file.',
    type: '(path: string): Promise<Record<string, any>>',
    params: [
      {
        name: 'path',
        type: 'string',
        desc: 'JSON file path.'
      }
    ],
    returns: 'JSON file data.'
  }"
/>

```ts
await readJSON('abc/ab.json')
```

### createFile
<FunctionBlock
  :options="{
    desc: 'Create file with content.',
    type: '(path: string, content?: string, options?: Partial<CreateFileOptions>): Promise<boolean>',
    params: [
      {
        name: 'path',
        type: 'string',
        desc: 'File path.'
      },
      {
        name: 'content',
        type: 'string',
        desc: 'File content.',
      },
      {
        name: 'options',
        type: 'CreateFileOptions',
        desc: 'Options of operation.',
        url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/create.ts#L9'
      }
    ],
    returns: 'Created file path.'
  }"
/>

```ts
await createFile('/foo/bar.json', JSON.stringify({}))
```

### createDir
<FunctionBlock
  :options="{
    desc: 'Create directory.',
    type: '(path: string, options?: Partial<CreateDirOptions>): Promise<boolean>',
    params: [
      {
        name: 'path',
        type: 'string',
        desc: 'Directory path.'
      },
      {
        name: 'options',
        type: 'CreateFileOptions',
        desc: 'Options of operation.',
        url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/create.ts#L60'
      }
    ],
    returns: 'Created directory path.'
  }"
/>

```ts
await createDir('foo/bar')
```

### copyFile
<FunctionBlock
  :options="{
    desc: 'Copy file.',
    type: '(src: string, dest: string, options?: Partial<CopyFileOptions>): Promise<boolean>',
    params: [
      {
        name: 'src',
        type: 'string',
        desc: 'Source file path.'
      },
      {
        name: 'dest',
        type: 'string',
        desc: 'Destination file path.'
      },
      {
        name: 'options',
        type: 'CopyFileOptions',
        desc: 'Options of operation.',
        url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/copy.ts#L17'
      }
    ],
    returns: 'Result of operation.'
  }"
/>

```ts
await copyFile('/foo/bar.json', '/foo/baz.json')
```

### copyDir
<FunctionBlock
  :options="{
    desc: 'Copy directory.',
    type: '(src: string, dest: string, options?: Partial<CopyDirOptions>): Promise<CopyDirResult>',
    params: [
      {
        name: 'src',
        type: 'string',
        desc: 'Source directory path.'
      },
      {
        name: 'dest',
        type: 'string',
        desc: 'Destination directory path.'
      },
      {
        name: 'options',
        type: 'CopyDirOptions',
        desc: 'Options of operation.',
        url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/copy.ts#L58'
      }
    ],
    returns: 'Result of operation.',
    resultType: {
      name: 'CopyDirResult',
      url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/copy.ts#L62'
    }
  }"
/>

```ts
const { src, dest, add, update, skip } = await copyDir('/foo/bar', '/foo/baz')
```

### moveFile
<FunctionBlock
  :options="{
    desc: 'Move file.',
    type: '(src: string, dest: string, options?: Partial<MoveFileOptions>): Promise<boolean>',
    params: [
      {
        name: 'src',
        type: 'string',
        desc: 'Source file path.'
      },
      {
        name: 'dest',
        type: 'string',
        desc: 'Destination file path.'
      },
      {
        name: 'options',
        type: 'MoveFileOptions',
        desc: 'Options of operation.',
        url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/move.ts#L20'
      }
    ],
    returns: 'Result of operation.'
  }"
/>

```ts
await moveFile('foo/bar.txt')
```

### moveDir
<FunctionBlock
  :options="{
    desc: 'Move directory.',
    type: '(src: string, dest: string, options?: Partial<MoveDirOptions>): Promise<MoveDirResult>',
    params: [
      {
        name: 'src',
        type: 'string',
        desc: 'Source directory path.'
      },
      {
        name: 'dest',
        type: 'string',
        desc: 'Destination directory path.'
      },
      {
        name: 'options',
        type: 'MoveDirOptions',
        desc: 'Options of operation.',
        url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/move.ts#L72'
      }
    ],
    returns: 'Result of operation.',
    resultType: {
      name: 'MoveDirResult',
      url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/move.ts#L76'
    }
  }"
/>

```ts
const { all, src, dest, add, update, skip } = await moveDir('foo/bar', 'foo/baz')
```

### emptyDir
<FunctionBlock
  :options="{
    desc: 'Empty directory.',
    type: '(path: string, options?: Partial<EmptyDirOptions>): Promise<EmptyDirResult>',
    params: [
      {
        name: 'path',
        type: 'string',
        desc: 'Directory path.'
      },
      {
        name: 'options',
        type: 'EmptyDirOptions',
        desc: 'Options of operation.',
        url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/empty.ts#L13'
      }
    ],
    returns: 'Result of operation.',
    resultType: {
      name: 'EmptyDirResult',
      url: 'https://github.com/Kythuen/ephemeras/blob/main/packages/fs/src/empty.ts#L14'
    }
  }"
/>

```ts
const { all, done, skip } = await emptyDir('foo/bar')
```
