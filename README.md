# Atom Git-Diff-Plus package

<!-- [![OS X Build Status](https://travis-ci.org/atom/git-diff.svg?branch=master)](https://travis-ci.org/atom/git-diff) [![Windows Build Status](https://ci.appveyor.com/api/projects/status/9auj52cs0vso66nv/branch/master?svg=true)](https://ci.appveyor.com/project/Atom/git-diff/branch/master) [![Dependency Status](https://david-dm.org/atom/git-diff.svg)](https://david-dm.org/atom/git-diff) -->

Marks lines in the editor gutter that have been added, edited, or deleted since the last commit.

  * <kbd>alt-g up</kbd> to move the cursor to the previous diff in the editor
  * <kbd>alt-g down</kbd> to move the cursor to the next diff in the editor

![](https://f.cloud.github.com/assets/671378/2241519/04791a24-9cd6-11e3-9a12-164cabe81d58.png)


## TODOs

- [x] @TODO Rename package
- [ ] @TODO Update README
- [ ] @TODO Recommend an user disable the bundled [`git-diff`](https://github.com/atom/atom/tree/master/packages/git-diff) package if it's enabled
- [x] @TODO Make a config setting to disable Status-Bar integration
- [ ] @TODO Add a click event handler to the Status-Bar tile
- [ ] @TODO Merge [status-bar-controller.js](lib/status-bar-controller.js) into [git-diff-view.js](lib/git-diff-view.js)
    * It will remove the duplicated subscription to the same git repository, but the code may lead to be more complicated
        + [status-bar-controller.js](lib/status-bar-controller.js) is only for a single file at a time
        + but multiple [git-diff-view.js](lib/git-diff-view.js) instances are there at the same time
