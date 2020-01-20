## v0.4.2

- update documentations

## v0.4.1

- fixes #12

## v0.4.0

- only shows actually changed diffs in status-bar
![image](https://user-images.githubusercontent.com/40514306/60886819-da6a5180-a28d-11e9-99d6-9ba1ee658cd5.png)
- update README
  * add how to install
  * recommend disabling `git-diff` package
  * add expiations for config settings

## v0.3.1

- fixes the wording in README

## v0.3.0

- changed repository caching behavior drastically
  * don't caches already searched repositories
    + it seems that Atom caches the previously created repository objects by default, thus there was not difference between caching and non-caching on our side
    + as a result, each searching operation will only take ~10ms
  * only caches editors under **non-.git** directories for better performance
- register `Git Diff Plus: Rebuild Repository Cache` command to rebuild the cache so that this package can recognize an newly created .git repository at a later time
- status-bar integration now correctly cleared for files under non-.git directories
- deleted unused `standard` dependency from `devDependencies`
- update TODOs

## v0.2.0

- made this file
- set up CI
  * travis
  * AppVeyor

## v0.1.0

- add `context` menu
- changed the package name
- integrate status-bar to show diffs in it
  * register click event listener to the tile
- refactored the original code base:
  * moved to ES6
  * better disposers
  * update specs
- enable diffs for files outside of current projects:
  * made New repository finder
  * added specs for it
- prepare development environment:
  * `eslint`
  * `prettier`
  * `husky` & `lint-staged`
