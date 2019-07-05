/** @babel */

import { CompositeDisposable, Disposable, TextEditor } from 'atom';

import GitDiffView from './git-diff-view';
import DiffListView from './diff-list-view';
import { disposeRepositoryCache } from './helpers';

const GitDiff = {
  activate() {
    this.diffListView = null;
    this.watchedEditors = new WeakMap();

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.workspace.observeTextEditors(editor => {
        this.watchEditor(editor);
      })
    );
    this.subscriptions.add(
      new Disposable(() => {
        if (this.diffListView) this.diffListView.destroy();
        this.diffListView = null;
        disposeRepositoryCache();
      })
    );

    // Start watching the initially opened editors
    atom.workspace.getTextEditors().forEach(editor => {
      this.watchEditor(editor);
    });
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  watchEditor(editor) {
    if (this.watchedEditors.has(editor)) return;

    new GitDiffView(editor).start();
    this.watchedEditors.set(editor);

    const editorSubscriptions = new CompositeDisposable();
    editorSubscriptions.add(
      atom.commands.add(
        atom.views.getView(editor),
        'git-diff:toggle-diff-list',
        () => {
          if (this.diffListView == null) this.diffListView = new DiffListView();
          this.diffListView.toggle();
        }
      )
    );
    editorSubscriptions.add(
      editor.onDidDestroy(() => {
        editorSubscriptions.dispose();
        this.watchedEditors.delete(editor);
      })
    );
  }
};

export default GitDiff;
