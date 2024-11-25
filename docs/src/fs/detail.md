# Features

<!-- ## Common -->

### unixPath()
Convert path to unix format.

- Type
  ```ts
  (path: string): string
  ```

- Details
  - `path`: Path to convert.

- Examples

  ```ts
  unixPath('abc/ab/c')        //--> 'abc/ab/c'
  unixPath('abc\\ab\\c')      //--> 'abc/ab/c'
  ```

### relativePath()
Get relative path from base path.

- Type
  ```ts
  (path: string, base?: string): string
  ```

- Details
  - `path`: Source path.
  - `base`: Base path.

- Examples

  ```ts
  relativePath('/abc/b/1.txt', '/abc')      //--> 'b/1.txt'
  relativePath('/abc/b/1.txt', 'abc\\b')    //--> '1.txt'
  ```

<!-- ## Stats -->

### stats()
Get path stats information.

- Type
  ```ts
  (path: string): Promise<Stats>
  ```

- Details
  - `path`: Path to check.

- Examples

  ```ts
  (await getStats('foo/bar')).isFile()      //--> false
  ```

<!-- ## Exists -->

### exists()
Determine path exists or not.

- Type
  ```ts
  (path: string): Promise<Stats>
  ```

- Details
  - `path`: The path you want to determine.

- Examples

  ```ts
  await exists('foo/bar')        //--> false
  ```
