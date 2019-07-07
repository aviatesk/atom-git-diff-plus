# Atom git-diff-plus package

[![Ubuntu Build Status](https://travis-ci.org/aviatesk/atom-git-diff-plus.svg?branch=master)](https://travis-ci.org/aviatesk/atom-git-diff-plus/)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/1nytyu2csyuvftt9/branch/master?svg=true)](https://ci.appveyor.com/project/aviatesk/atom-git-diff-plus)

The better and happier alternative for [`git-diff`][git-diff] package for Atom editor.

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/40514306/60759461-cdb4e600-a060-11e9-856b-559e006f6f79.gif)


## Features

This `git-diff-plus` package was originally a clone of `git-diff` package, bundled with Atom itself by default, and covers _every_ functionality provided by it, but also includes lots of enhancements and refactors.

There are mainly these advantages below for you to use `git-diff-plus` over `git-diff`.

1. Tracks git diffs for every file under .git repository, meaning you can **see the diffs of files both in the current Atom projects and outside of the projects**
    * `git-diff` can only shows diffs of files in current projects ...

2. Indicates _per-file_ diffs **in the Status-Bar** as well as in editor gutters
    * ![image](https://user-images.githubusercontent.com/40514306/60760048-98f95c80-a069-11e9-80a9-c3fefeb3de49.png)
    * Of course you can disable this integration via your config setting

3. Includes a lot of valuable refactors. E.g.:
    * **Can recognize an newly added repository**
    * **Don't cause error after an previously recognized repository is removed**
    * Gutter icons don't collide with gutter elements exported by [Atom-IDE-UI](https://atom.io/packages/atom-ide-ui)
    * Better disposers, minimal condition checks
    * and etc...


## Installation

1. Install [Atom](https://atom.io/)
2. Install `git-diff-plus` package: Follow either way below
    - Run command `apm install git-diff-plus`
    - Follow GUI menu `File -> Settings -> Install` and search for `git-diff-plus` and click `Install` button
3. Disable [`git-diff`][git-diff] package: Follow either way
    * Run command `apm disable git-diff`
    * Follow the GUI menu `File -> Settings -> Packages` and search for `git-diff` and click `Disable` button
4. Open any file under .git repository

Notes:
- `git-diff` package is bundled with Atom itself by default
- Disabling `git-diff` is recommended to avoid duplicated works and collisions of the commands
    * Don't worry, `git-diff-plus` overrides _every_ functionality provided by `git-diff`
* Actually `git-diff-plus` would automatically detect if `git-diff` is activated and if so shows buttons to disable it via an notification, thus you can even skip step 3.


## Usage

### UI

#### Diff indicators in editor gutters:

| Config: `Show Icons In Editor Gutter` | `false` (default)                                                                                                       | `true`                                                                                                                  |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Gutter                                | <!-- test --> ![](https://user-images.githubusercontent.com/40514306/60879414-886d0000-a27c-11e9-8474-3e6e7fdc2b3d.png) | <!-- test --> ![](https://user-images.githubusercontent.com/40514306/60879638-f7e2ef80-a27c-11e9-8135-fbf19f44311c.png) |

#### Diff indicators in the Status-bar

![image](https://user-images.githubusercontent.com/40514306/60760048-98f95c80-a069-11e9-80a9-c3fefeb3de49.png)
- You can click the Status-Bar tile to invoke `git-diff-plus:Toggle-Diff-List`
- Disable this tile via setting config `Show Diffs In Status Bar` to `false`

### Command

- `Git Diff Plus: Move To Previous Diff` (<kbd>Alt-G Up</kbd>): move the cursor to the previous diff in the editor
- `Git Diff Plus: Toggle Diff List` (<kbd>Alt-G D</kbd>): see all the diffs in a current active editor
- `Git Diff Plus: Rebuild Repository Cache`: invoke this command when you find diffs for an newly added repository is not recognized


## Why `git-diff-"plus"` ?,

There is a difficult issue around finding a correct .git repository and the Atom's core team is now trying to solve [this in an higher level](https://github.com/atom/github/issues/1835), thus the specific issues around it are [kind of pending](https://github.com/atom/atom/issues/19584) AFAIU.

But still I found the fixes to them are really useful, and so this package is here as a community package. Thus, in that sense, this package is a temporal remedy for the issues like:
- https://github.com/atom/atom/issues/19584
- https://github.com/atom/github/issues/1035

Even this package works very fine as far as I've used this, this package may fail to find/subscribe a repository (still I'm sure the method that this `git-diff-plus` uses to find/subscribe .git repository is much more better than the original `git-diff` though).
 So please help me find issues by reporting it if you encounter a problem !


## License

This package is under [MIT License](LICENSE.md), which is the modified version of [the original MIT License](https://github.com/atom/atom/blob/master/packages/git-diff/LICENSE.md).


## Acknowledgements

The original code base was borrowed from the one in [`git-diff`][git-diff] package.


## Author

- **KADOWAKI, Shuhei** - *Undergraduate@Kyoto Univ.* - [aviatesk]


<!-- Links -->

[git-diff]: https://github.com/atom/atom/tree/master/packages/git-diff
[aviatesk]: https://github.com/aviatesk
