# Atom git-diff-plus package

[![Ubuntu Build Status](https://travis-ci.org/aviatesk/atom-git-diff-plus.svg?branch=master)](https://travis-ci.org/aviatesk/atom-git-diff-plus/)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/1nytyu2csyuvftt9/branch/master?svg=true)](https://ci.appveyor.com/project/aviatesk/atom-git-diff-plus)

An alternative for [`git-diff`][git-diff] package for :atom: editor.

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/40514306/60759461-cdb4e600-a060-11e9-856b-559e006f6f79.gif)


## Features

`git-diff-plus` covers _every_ functionality provided by `git-diff`, which comes with Atom by default, but also provides lots of some additional features and various improvements.

There are mainly three advantages below for you to use `git-diff-plus` over `git-diff`.

`git-diff-plus`:

1. tracks diffs for every file under .git repository, meaning you can see **diffs in files outside of a current project** as well as diffs in ones under the current project
    * `git-diff` can only shows diffs in files under a current project ...
2. indicates **_per-file_ diffs in status-bar** as well as in editor gutters
    * ![image](https://user-images.githubusercontent.com/40514306/60760048-98f95c80-a069-11e9-80a9-c3fefeb3de49.png)
    * of course you can disable this integration via your config setting
3. includes a lot of minor improvements/refactors. E.g.:
    * **can recognize an newly added repository**
    * **doesn't cause error after an previously recognized repository is removed**
    * gutter icons don't collide with gutter elements exported by [atom-ide-ui](https://atom.io/packages/atom-ide-ui)
    * better disposers, minimal condition checks
    * and etc...


## Installation

1. Install [:atom:](https://atom.io/)
2. Install `git-diff-plus` package: Follow either way below
    - Run command `apm install git-diff-plus`
    - Follow GUI menu `File -> Settings -> Install` and search for `git-diff-plus` and click `Install` button
3. Disable [`git-diff`][git-diff] package: Follow either way
    * Run command `apm disable git-diff`
    * Follow the GUI menu `File -> Settings -> Packages` and search for `git-diff` and click `Disable` button
4. Open any file under .git repository

Notes:
- `git-diff` package is bundled with Atom by default
- Disabling `git-diff` is recommended to avoid duplicated works and collisions of the commands
    * Don't worry, `git-diff-plus` covers _every_ functionality provided by `git-diff`
* On Atom's startup, `git-diff-plus` would automatically detect if `git-diff` is activated and if so shows buttons to disable it, thus you can even skip step 3.


## Usage

### UI

#### Diff indicators in editor gutters:

| Config: `Show Icons In Editor Gutter` | `false` (default)                                                                                                       | `true`                                                                                                                  |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Gutter                                | <!-- test --> ![](https://user-images.githubusercontent.com/40514306/60879414-886d0000-a27c-11e9-8474-3e6e7fdc2b3d.png) | <!-- test --> ![](https://user-images.githubusercontent.com/40514306/60879638-f7e2ef80-a27c-11e9-8135-fbf19f44311c.png) |

#### Diff indicators in the Status-bar

![image](https://user-images.githubusercontent.com/40514306/60760048-98f95c80-a069-11e9-80a9-c3fefeb3de49.png)
- You can click the status-bar tile to invoke `Git Diff Plus: Toggle Diff List` command
- Disable this tile via setting config `Show Diffs In Status Bar` to `false`

### Command

- `Git Diff Plus: Move To Previous Diff` (<kbd>Alt-G Up</kbd>): move the cursor to the previous diff in the editor
- `Git Diff Plus: Toggle Diff List` (<kbd>Alt-G D</kbd>): see all the diffs in a current active editor
- `Git Diff Plus: Rebuild Repository Cache`: invoke this command when you find diffs for an newly added repository is not recognized


## Why not merging to `git-diff` ?

There is a difficult issue around finding a correct .git repository actually, and the Atom's core team is now trying to solve [this in an higher level](https://github.com/atom/github/issues/1835), thus the specific issues around it are [kind of pending](https://github.com/atom/atom/issues/19584).

But still I found the fixes for them are really useful even though they are not perfect, so `git-diff-plus` is here as a community package. In a sense, this package serves as a temporal remedy for the specific issues like:
- https://github.com/atom/atom/issues/19584
- https://github.com/atom/github/issues/1035

I'm really sure the logic to find/subscribe .git repository used in `git-diff-plus` is _much more better_ than the one used in `git-diff`, still it may fail to find/subscribe a repository.
Even this package works very fine as far as I've used, but in a case you encounter a problem, please help me find issues by reporting it !


## License

This package is under [MIT License](LICENSE.md), which is the modified version of [the original one of `git-diff` package](https://github.com/atom/atom/blob/master/packages/git-diff/LICENSE.md).


## Acknowledgements

This package is originally a clone of [`git-diff`][git-diff] package.


## Author

- **Shuhei Kadowaki** - *undergraduate @ kyoto univ.* - [aviatesk]


<!-- Links -->

[git-diff]: https://github.com/atom/atom/tree/master/packages/git-diff
[aviatesk]: https://github.com/aviatesk
