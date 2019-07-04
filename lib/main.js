const GitDiffView = require('./git-diff-view');
const DiffListView = require('./diff-list-view');

let diffListView = null;
let watchedEditors = new WeakSet();

module.exports = {
  activate() {
    atom.workspace.observeTextEditors(editor => {
      watchEditor(editor);
    });

    atom.workspace.getTextEditors().forEach(editor => {
      watchEditor(editor);
    });
  },

  deactivate() {
    if (diffListView) diffListView.destroy();
    diffListView = null;
  }
};

function watchEditor(editor) {
  if (watchedEditors.has(editor)) return;

  new GitDiffView(editor).start();
  atom.commands.add(
    atom.views.getView(editor),
    'git-diff:toggle-diff-list',
    () => {
      if (diffListView == null) diffListView = new DiffListView();
      diffListView.toggle();
    }
  );

  watchedEditors.add(editor);
  editor.onDidDestroy(() => watchedEditors.delete(editor));
}
