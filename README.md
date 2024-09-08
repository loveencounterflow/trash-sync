
# Trash-Sync


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Trash-Sync](#trash-sync)
  - [To Do](#to-do)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


A tiny NodeJS CJS module to trash files and directories synchronously

# Trash-Sync

`trash-sync` allows to trash files synchronously. This comes handy if you have a fully synchronous piece of
software and want to avoid to make everything asynchronous just to delete a file the safe way. `trash-sync`
uses [`sindresorhus/trash`](https://github.com/sindresorhus/trash), which see for features and limitations.

`trash-sync` exports a single function, `trash()`, that takes as its only argument a path to the file system
object you want to delete. It will

* return `0` if there was nothing to trash;
* return `1` if a file or directory has been trashed
* throw an error where [`sindresorhus/trash`](https://github.com/sindresorhus/trash) throws an error, most
  commonly when a user with insufficient privileges tries to trash a file

Example:

```js
{ trash, } = require( 'trash-sync' );
console.log( "trashed ", trash( 'path/to/file' ), " file(s)." );
```

## To Do

* **[+]** make `trash` `import`able through submodule
* **[+]** `cd` to correct directory before `spawnSync()`

