# Atom Git-Diff-Plus package

[![Ubuntu Build Status](https://travis-ci.org/aviatesk/atom-git-diff-plus.svg?branch=master)](https://travis-ci.org/aviatesk/atom-git-diff-plus/)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/1nytyu2csyuvftt9/branch/master?svg=true)](https://ci.appveyor.com/project/aviatesk/atom-git-diff-plus)

The alternative for [`Git-Diff` package][Git-Diff] for Atom editor.

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/40514306/60759461-cdb4e600-a060-11e9-856b-559e006f6f79.gif)


## Features

This package was originally a clone of [`Git-Diff`](https://github.com/atom/atom/tree/master/packages/git-diff) package, bundled with Atom itself by default, and covers _every_ functionality provided by it, but also includes lots of enhancements and refactors.

There are mainly these advantages below for you to use this **`Git-Diff-Plus`** package over that.

1. Tracks git diffs for every file under .git repository, meaning you can **see the diffs of files both in the current Atom projects and outside of the projects**
    * [Git-Diff][Git-Diff] can only shows diffs of files in current projects ...
2. Indicates _per-file_ diffs **in the Status-Bar** as well as in editor gutters
    * Of course you can disable this integration via your config setting
3. Includes a lot of valuable refactors. E.g.:
    * Gutter icons work correctly when [Atom-IDE-UI](https://atom.io/packages/atom-ide-ui) is active
    * Better disposers, minimal condition check, and etc...


## Usage

Commands:
- `Git-Diff-Plus:Move-To-Previous-Diff` (<kbd>Alt-G Up</kbd>): move the cursor to the previous diff in the editor
- `Git-Diff-Plus:Move-To-Next-Diff` (<kbd>Alt-G Down</kbd>): move the cursor to the next diff in the editor
- `Git-Diff-Plus:Toggle-Diff-List` (<kbd>Alt-G D</kbd>): see all the diffs in a current active editor

You can also click the Status-Bar tile to invoke `Git-Diff-Plus:Toggle-Diff-List`:

![image](https://user-images.githubusercontent.com/40514306/60760048-98f95c80-a069-11e9-80a9-c3fefeb3de49.png)


## Why `Git-Diff-"Plus"` ?

There is a difficult issue around finding a correct .git repository and the Atom's core team is now trying to solve [this in an higher level](https://github.com/atom/github/issues/1835), thus the specific issues around it are [kind of pending](https://github.com/atom/atom/issues/19584) AFAIU.

But still I found the fixes to them are really useful, and so this package is here as a community package. Thus, in that sense, this package is a temporal remedy for the issues like:
- https://github.com/atom/atom/issues/19584
- https://github.com/atom/github/issues/1035

Even this package works very fine as far as I've used this, this package may fail to find/subscribe a repository. So please help me find issues by reporting it if you encounter a problem !


## License

This package is under [MIT License](LICENSE.md)


## Acknowledgements

The original code base was borrowed from the one in [Git-Diff][Git-Diff].


## Author

- **KADOWAKI, Shuhei** - *Undergraduate@Kyoto Univ.* - [aviatesk]


<!-- Links -->

[Git-Diff]: https://github.com/atom/atom/tree/master/packages/git-diff
[aviatesk]: https://github.com/aviatesk
