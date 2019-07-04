const path = require('path');
const fs = require('fs-plus');
const { Directory } = require('atom');

exports.repositoryForEditorPath = function(editorPath) {
  const dirPath = path.dirname(editorPath);
  const directory = new Directory(dirPath, {
    symlink: fs.isSymbolicLinkSync()
  });

  return atom.project.repositoryForDirectory(directory);
};
