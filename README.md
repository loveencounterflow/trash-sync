
# Trash-Sync


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Trash-Sync](#trash-sync)
  - [Description](#description)
  - [Example](#example)
  - [Discussion](#discussion)
    - [The Problem](#the-problem)
    - [The Solution](#the-solution)
  - [To Do](#to-do)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


A tiny NodeJS CJS module to trash files and directories synchronously

# Trash-Sync

## Description

`trash-sync` allows to trash files synchronously. This comes handy if you have a fully synchronous piece of
software and want to avoid to make everything asynchronous just to delete a file the safe way. `trash-sync`
uses [`sindresorhus/trash`](https://github.com/sindresorhus/trash), which see for features and limitations.

`trash-sync` exports a single function, `trash()`, that takes as its only argument a path to the file system
object you want to delete. It will

* return `0` if there was nothing to trash;
* return `1` if a file or directory has been trashed
* throw an error where [`sindresorhus/trash`](https://github.com/sindresorhus/trash) throws an error, most
  commonly when a user with insufficient privileges tries to trash a file

## Example

```js
{ trash, } = require( 'trash-sync' );
console.log( "trashed ", trash( 'path/to/file' ), " file(s)." );
```

## Discussion

### The Problem

[`sindresorhus/trash`](https://github.com/sindresorhus/trash) allows to move files and directories into the
OS trash bin across Linux, Windows, and MacOS; when used programmatically (i.e. with a function call from
within NodeJS), it is always asynchronous, and there's no synchronous alternative provided.

There are valid use cases for doing as much as possible in a synchronous way as asynchronicity, useful as it
is, has its downsides: one is the so-called 'red function / black function' problem which means that while
async functions may cal sync functions, the reverse is not true: when you have a synchronous function `f()`
that has to call an async function `g()`, now you have to turn `f()` into an async function, too. That is,
asynchronicity 'taints' everything that touches it.

That would be less of a problem if it wasn't for synchronous control flow being inherently less complicated,
and on top of that, one has also to pay a small overhead for calling an async function for the inherent
amount of book-keeping that is done behind the scenes.

Thus, from a principled point of view, synchronous program execution is and remains the preferred and more
generic mode of program execution. This becomes obvious when one realizes that there is at least one
situation where asynchronicity is more or less forbidden in JavaScript, and that is inside of class
`constructor()`s. This entails that if you want to trash a file within a class's `constructor()` method
(check, as far as I'm concerned), and there's no synchronous alternative to
[`sindresorhus/trash`](https://github.com/sindresorhus/trash) (apparently true before v1.1.0 of
`trash-sync`), all you've left is roll your own (which is what I did here).

As for the solutions, one could simply use `trash` on the Linux / POSIX (?) command line, but that
constitutes an external dependency (as `trash` is apparently not an out-of-the-box pre-installed standard in
distros), and it also limits the software to being used on Linux only. One could also somehow re-implement
`trash`ing files, but a quiclk look convinced me that that was too much to ask for (it's seriously knotty
unfortunately, at least on Linux). It also has the reinvent-the-wheel problem and needlessly trashes [sorry]
the great work and effort that has gone into [`sindresorhus/trash`](https://github.com/sindresorhus/trash)
as it stands.

### The Solution

`trash-sync` achieves its goal by using NodeJS's `child_process.spawnSync()` method to 'convert' an
asynchronously executing piece of code into a synchronously executing one, and this already describes the
biggest downside of `trash-sync`: since it has to spawn not only a sub-process, but one with all of NodeJS
loaded, initialized and running, it's bound to be slow in execution and heavy on resources. I'm sorry.

## To Do

* **[+]** make `trash` `import`able through submodule
* **[+]** `cd` to correct directory before `spawnSync()`

