/** @babel */

const path = require('path');
const fs = require('fs-plus');
const { Directory } = require('atom');

export const MAX_BUFFER_LENGTH_TO_DIFF = 2 * 1024 * 1024;

let repositoryCache;

export function initializeRepositoryCache() {
  repositoryCache = new WeakMap();
}

export async function repositoryForEditor(editor) {
  if (repositoryCache.has(editor)) {
    const repo = repositoryCache.get(editor);
    const repoPath = repo.getPath();
    const repoDir = new Directory(repoPath, {
      symlink: fs.isSymbolicLinkSync(repoPath)
    });
    if (repoDir.existsSync()) {
      return repo;
    } else {
      // Search for a new repository if the cached one is already destroyed
      repositoryCache.delete(editor);
    }
  }

  const editorPath = editor.getPath();
  const dirPath = path.dirname(editorPath);
  const directory = new Directory(dirPath, {
    symlink: fs.isSymbolicLinkSync(dirPath)
  });

  const repository = await atom.project.repositoryForDirectory(directory);
  if (repository) {
    repositoryCache.set(editor, repository);
    return repository;
  }

  // Fallbacks to project-base repository search when any repository is found by above procedure
  const dirs = atom.project.getDirectories();
  for (let i = 0; i < dirs.length; i += 1) {
    const dir = dirs[i];
    if (editorPath === dir.getPath() || dir.contains(editorPath)) {
      const repo = atom.project.repositoryForDirectory(dir);
      repositoryCache.set(editor, repo);
      return repo;
    }
  }
  return null;
}

export function disposeRepositoryCache() {
  repositoryCache = null;
}
