## v0.3.1

### :book: Documentation

- Fixes the wording in README


## v0.3.0

### :tada: Improvements

- Changed repository caching behavior drastically
    * Don't caches already searched repositories
        + It seems that Atom caches the previously created repository objects by default, thus there was not difference between caching and non-caching on our side
        + As a result, each searching operation will only take ~10ms
    * Only caches editors under **non-`.git`** directories for better performance
- Register `Git Diff Plus: Rebuild Repository Cache` command to rebuild the cache so that `Git-Diff-Plus` can recognize an newly created `.git` repository at a later time

### :bug: Bug fixes

- Status-bar integration now correctly cleared for files under non-`.git` directories

### :construction_worker: Internal improvements

- Deleted unused `standard` dependency from `devDependencies`
- Update TODOs


## v0.2.0

- Made this file
- Set up CI
    * Travis
    * AppVeyor


## v0.1.0

- Add `context` menu
- Changed the package name
- Integrate Status-Bar to show diffs in it
    * Register click event listener to the tile
- Refactored the original code base:
    * Moved to ES6
    * Better disposers
    * Update specs
- Enable diffs for files outside of current projects:
    * Made New repository finder
    * Added specs for it
- Prepare development environment:
    * `eslint`
    * `prettier`
    * `husky` & `lint-staged`
