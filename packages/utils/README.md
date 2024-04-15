- 确认路径是否存在 ensureExists
- 创建文件 createFile
- 创建文件夹 ensureExists(folderPath, 'folder')
- 复制文件或文件夹 copy

- isExist 判断 access constants.F_OK; code ?== 'ENOENT'
- isReadable 判断 access constants.R_OK; code ?== 'EACESS' || 'EXDEV'
- isWriteable 判断 access constants.W_OK;

<!-- emptyDir -->
<!-- prettierFile? -->

> fs 需要全局安装 prettier

chmod(7)
7 read, write, and execute
6 read and write
5 read and execute
4 read only
3 write and execute
2 write only
1 execute only
0 no permission

- 普通移动：rename
- filter 不为空, 递归判断: renameRecursively

copy

- all src 总共有多少项需要操作 done + undo = all
- done src 操作了哪些项
- undo src 哪些项没有操作
- modify dest 目标文件夹变动了哪些项
- delete src 减少了哪些项
