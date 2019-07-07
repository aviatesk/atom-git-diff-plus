/** @babel */

import { CompositeDisposable, Disposable } from 'atom';

import GitDiffView from './git-diff-view';
import StatusBarController from './status-bar-controller';
import DiffListView from './diff-list-view';
import {
  recommendDisableGitDiff,
  initializeRepositoryCache,
  clearRepositoryCache
} from './helpers';

const GitDiffPlus = {
  activate() {
    this.watchedEditors = new WeakMap();
    this.diffListView = null;
    initializeRepositoryCache();

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.packages.onDidActivateInitialPackages(() => {
        if (atom.packages.isPackageActive('git-diff')) {
          recommendDisableGitDiff();
        }
      }),
      atom.workspace.observeTextEditors(editor => {
        this.watchEditor(editor);
      }),
      atom.commands.add(
        'atom-workspace',
        'git-diff-plus:rebuild-repository-cache',
        () => {
          initializeRepositoryCache();
        }
      ),
      new Disposable(() => {
        if (this.diffListView) this.diffListView.destroy();
        // @NOTE: Don't null out when in spec mode since the spec is full of async processes and
        //        these operations below would cause very complicated/annoying errors
        if (atom.inSpecMode()) return;
        this.diffListView = null;
        this.watchedEditors = null;
        clearRepositoryCache();
        this.subscriptions = null;
      })
    );
  },

  consumeStatusBar(statusBar) {
    const statusBarElement = document.createElement('a');
    statusBarElement.classList.add('git-diff-plus', 'inline-block');
    const onClick = _event => {
      event.preventDefault();
      this.toggleDiffListView();
    };
    statusBarElement.addEventListener('click', onClick);
    let statusBarTile = statusBar.addRightTile({
      item: statusBarElement,
      priority: -25
    });

    let statusBarController = new StatusBarController(statusBarElement);

    let statusBarSubsciption = new CompositeDisposable();
    this.subscriptions.add(
      atom.config.observe('git-diff-plus.showDiffsInStatusBar', value => {
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
        statusBarElement.removeEventListener('click', onClick);
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
        'git-diff-plus:toggle-diff-list',
        () => {
          this.toggleDiffListView();
        }
      ),
      editor.onDidDestroy(() => {
        editorSubscriptions.dispose();
        this.watchedEditors.delete(editor);
      })
    );
  },

  toggleDiffListView() {
    if (!this.diffListView) this.diffListView = new DiffListView();
    this.diffListView.toggle();
  }
};

export default GitDiffPlus;
