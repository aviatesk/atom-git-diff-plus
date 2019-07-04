const { CompositeDisposable } = require('atom');

const GitDiffView = require('./git-diff-view');
const DiffListView = require('./diff-list-view');

let diffListView = null;
let watchedEditors = new WeakSet();
let subscriptions = new CompositeDisposable();

module.exports = {
  activate() {
    subscriptions.add(
      atom.workspace.observeTextEditors(editor => {
        watchEditor(editor);
      })
    );
    subscriptions.add(
      atom.workspace.getTextEditors().forEach(editor => {
        watchEditor(editor);
      })
    );
  },

  deactivate() {
    if (diffListView) diffListView.destroy();
    diffListView = null;
    subscriptions.dispose();
  }
};

function watchEditor(editor) {
  if (watchedEditors.has(editor)) return;

  const editorSubscriptions = new CompositeDisposable();

  new GitDiffView(editor).start();
  watchedEditors.add(editor);
  editorSubscriptions.add(
    atom.commands.add(
      atom.views.getView(editor),
      'git-diff:toggle-diff-list',
      () => {
        if (diffListView == null) diffListView = new DiffListView();
        diffListView.toggle();
      }
    )
  );

  editorSubscriptions.add(
    editor.onDidDestroy(() => {
      watchedEditors.delete(editor);
      editorSubscriptions.dispose();
    })
  );
}
