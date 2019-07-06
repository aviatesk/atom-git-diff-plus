/** @babel */

const path = require('path');
const fs = require('fs-plus');
const { Directory } = require('atom');

export const MAX_BUFFER_LENGTH_TO_DIFF = 2 * 1024 * 1024;

export function recommendDisableGitDiff() {
  let message = atom.notifications.addInfo(
    '`Git-Diff-Plus`: Disable `Git-Diff` package ?',
    {
      buttons: [
        {
          text: 'Yes',
          onDidClick: () => {
            const minimapPluginScheme = 'minimap.plugins.git-diff';
            const isMinimapPluginEnabled = atom.config.get(minimapPluginScheme);
            atom.packages.disablePackage('git-diff');
            if (isMinimapPluginEnabled) {
              atom.config.set(minimapPluginScheme, true);
            }
            message.dismiss();
            message = null;
          }
        },
        {
          text: 'No',
          onDidClick: () => {
            message.dismiss();
            message = null;
          }
        }
      ],
      description: `\`Git-Diff-Plus\` package covers _every_ functionality provided by
       [\`Git-Diff\` package](https://github.com/atom/atom/tree/master/packages/git-diff),
       thus it is recommended that you disable it in order to avoid unnecessary duplicated works
       and the keybinding collisions.`,
      dismissable: true
    }
  );
}

let repositoryCache;

export function initializeRepositoryCache() {
  repositoryCache = new WeakMap();
}

export async function repositoryForEditor(editor) {
  const editorPath = editor.getPath();
  if (!editorPath) return;

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
