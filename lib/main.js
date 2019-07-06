/** @babel */

import { CompositeDisposable, Disposable } from 'atom';

import GitDiffView from './git-diff-view';
import StatusBarController from './status-bar-controller';
import DiffListView from './diff-list-view';
import { initializeRepositoryCache, disposeRepositoryCache } from './helpers';

const BetterGitDiff = {
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
        if (this.diffListView) this.diffListView.destroy();
        // @NOTE: Don't null out when in spec mode since the spec is full of async processes and
        //        these operations below would cause very complicated/annoying errors
        if (atom.inSpecMode()) return;
        this.diffListView = null;
        this.watchedEditors = null;
        disposeRepositoryCache();
        this.subscriptions = null;
      })
    );
  },

  consumeStatusBar(statusBar) {
    const statusBarElement = document.createElement('div');
    statusBarElement.classList.add('better-git-diff', 'inline-block');
    let statusBarTile = statusBar.addRightTile({
      item: statusBarElement,
      priority: -25
    });

    let statusBarController = new StatusBarController(statusBarElement);

    let statusBarSubsciption = new CompositeDisposable();
    this.subscriptions.add(
      atom.config.observe('better-git-diff.showDiffsInStatusBar', value => {
        if (value) {
          statusBarSubsciption.add(
            atom.workspace.onDidStopChangingActivePaneItem(_item => {
              statusBarController.updateEditor();
            })
          );
          statusBarController.initialize();
        } else {
          statusBarSubsciption.dispose();
          statusBarController.clear();
        }
      }),
      new Disposable(() => {
        statusBarTile.destroy();
        statusBarController.dispose();
        // @NOTE: Don't null out when in spec mode since the spec is full of async processes and
        //        these operations below would cause very complicated/annoying errors
        if (atom.inSpecMode()) return;
        statusBarTile = null;
        statusBarController = null;
        statusBarSubsciption.dispose();
        statusBarSubsciption = null;
      })
    );
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
        'better-git-diff:toggle-diff-list',
        () => {
          if (this.diffListView == null) this.diffListView = new DiffListView();
          this.diffListView.toggle();
        }
      ),
      editor.onDidDestroy(() => {
        editorSubscriptions.dispose();
        this.watchedEditors.delete(editor);
      })
    );
  }
};

export default BetterGitDiff;
