---
title: Types
description: Type Definition of <code>@ephemeras/parser</code>.
---

### BaseOptions

| Field | Type | Description | 
| ---- | ---- | ---- |
| context | string | Context directory. |
| relativize | boolean | Relativize the paths in result. |

### FilterOptions

| Field | Type | Description | 
| ---- | ---- | ---- |
| includes | string[] | Pattern matcher to include for operation. |
| excludes | string[] | Pattern matcher to exclude for operation. |
| filter | (src: string) => boolean | Filter by some condition for operation.<br>Return `true` to continue operation and `false` to skip it. |

### CrossHookOptions

| Field | Type | Description | 
| ---- | ---- | ---- |
| beforeEach | (src: string, dest: string) => any | Hook before each item been operated. |
| afterEach | (src: string, dest: string) => any | Hook after each item been operated. |

### CrossOperationResult

| Field | Type | Description | 
| ---- | ---- | ---- |
| src | string[] | Leaf items of source directory. |
| dest | string[] | Leaf items of destination directory. |
| add | string[] | Items which new add into destination directory. |
| update | string[] | Items which been overwrite in destination directory. |
| skip | string[] | Items which been skip in source directory. |

### ParserPluginParams
| Field | Type | Description | 
| ---- | ---- | ---- |
| files | Record<string, string | Buffer | null> | File set to operation. |
| map | Record<string, string> | Filename map of source & destination of File set. |
| parser | FileParser | Parser instance. |

### ParserOptions
| Field | Type | Description | 
| ---- | ---- | ---- |
| source | string | Source directory. |
| destination | string | Destination directory. |
| clean | boolean | Clear destination directory or not before operation. |
| overwrite | boolean | Overwrite existing file or directory. |
| plugins | ParserPlugin[] | Parser plugins. See plugins support. |
| context | string | Context directory. |
| relativize | boolean | Relativize the paths in result. |
| includes | string[] | Pattern matcher to include for operation. |
| excludes | string[] | Pattern matcher to exclude for operation. |
| filter | (src: string) => boolean | Filter by some condition for operation.\nreturn `true` to continue operation and `false` to skip it. |
| beforeEach | (src: string, dest: string) => any | Hook before each item been operated. |
| afterEach | (src: string, dest: string) => any | Hook after each item been operated. |