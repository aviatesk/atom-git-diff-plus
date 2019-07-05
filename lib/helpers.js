/** @babel */

const path = require('path');
const fs = require('fs-plus');
const { Directory } = require('atom');

let cache = {};

export async function repositoryForEditorPath(editorPath) {
  if (cache[editorPath]) return cache[editorPath];

  const dirPath = path.dirname(editorPath);
  const directory = new Directory(dirPath, {
    symlink: fs.isSymbolicLinkSync()
  });

  const repository = await atom.project.repositoryForDirectory(directory);
  if (repository) {
    cache[editorPath] = repository;
    return repository;
  }

  // Fallbacks to project-base repository search when any repository is found by above procedure
  const dirs = atom.project.getDirectories();
  for (let i = 0; i < dirs.length; i += 1) {
    const dir = dirs[i];
    if (editorPath === dir.getPath() || dir.contains(editorPath)) {
      const repo = atom.project.repositoryForDirectory(dir);
      cache[editorPath] = repo;
      return repo;
    }
  }
  return null;
}

export function disposeRepositoryCache() {
  cache = null;
}
