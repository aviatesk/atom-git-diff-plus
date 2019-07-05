/** @babel */

import { CompositeDisposable, Disposable, TextEditor } from 'atom';

import GitDiffView from './git-diff-view';
import DiffListView from './diff-list-view';
import { initializeRepositoryCache, disposeRepositoryCache } from './helpers';

const GitDiff = {
  activate() {
    this.watchedEditors = new WeakMap();
    this.diffListView = null;
    initializeRepositoryCache();

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.workspace.observeTextEditors(editor => {
        this.watchEditor(editor);
      }),
      new Disposable(() => {
        this.watchedEditors = null;
        if (this.diffListView) this.diffListView.destroy();
        this.diffListView = null;
        disposeRepositoryCache();
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
    this.subscriptions = null;
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
