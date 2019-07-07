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

let nonGitEditorCache;

export function initializeRepositoryCache() {
  clearRepositoryCache();
  nonGitEditorCache = new WeakSet();
}

export function clearRepositoryCache() {
  nonGitEditorCache = null;
}

// @NOTE: This function would take around 100ms for the first searching for a repository.
//        Once the reository object has been created, each call will only take up to 10ms
//        as far as referencing the same repository object
export async function repositoryForEditor(editor) {
  const editorPath = editor.getPath();
  if (!editorPath || nonGitEditorCache.has(editor)) return null;

  const dirPath = path.dirname(editorPath);
  const directory = new Directory(dirPath, {
    symlink: fs.isSymbolicLinkSync(dirPath)
  });

  const repository = await atom.project.repositoryForDirectory(directory);
  if (repository) return repository;

  // Fallbacks to project-base repository search when any repository is found by above procedure
  const dirs = atom.project.getDirectories();
  for (let i = 0; i < dirs.length; i += 1) {
    const dir = dirs[i];
    if (editorPath === dir.getPath() || dir.contains(editorPath)) {
      const repo = await atom.project.repositoryForDirectory(dir);
      if (repo) return repo;
    }
  }

  // @NOTE: Caches editors under non .git directory for better performance, but at the cost of that,
  //        cached editors can't recognize an newly created .git repository until the
  //        `Git-Diff-Plus: Rebuild-Repository-Cache` gets called
  nonGitEditorCache.add(editor);
  return null;
}
