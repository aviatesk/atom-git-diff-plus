/** @babel */

import { CompositeDisposable } from 'atom';

import { MAX_BUFFER_LENGTH_TO_DIFF, repositoryForEditor } from './helpers';

export default class StatusBarView {
  constructor(statusBarElement) {
    this.statusBarElement = statusBarElement;

    this.editorSubscriptions = new CompositeDisposable();
    this.repositorySubscriptions = new CompositeDisposable();

    const editor = atom.workspace.getActiveTextEditor();
    if (editor) this.updateEditor(editor);
  }

  async updateEditor() {
    const editor = atom.workspace.getActiveTextEditor();

    this.editor = editor;
    if (!editor || !(await this.subscribeToRepository())) {
      this.clear();
      return;
    }
    this.subscribeToEditor(editor);

    this.scheduleUpdate();
  }

  async subscribeToRepository() {
    this.repository = await repositoryForEditor(this.editor);
    if (!this.repository) return null;
    this.repositorySubscriptions.add(
      this.repository.onDidChangeStatus(event => {
        if (event.path === this.editor.getPath()) {
          this.scheduleUpdate();
        }
      })
    );
    return this.repository;
  }

  subscribeToEditor(editor) {
    this.editorSubscriptions.add(
      editor.onDidStopChanging(() => {
        this.scheduleUpdate();
      }),
      editor.onDidChangePath(() => {
        this.subscribeToRepository();
      }),
      editor.onDidDestroy(() => {
        this.cancelUpdate();
        this.clear();
      })
    );
  }

  scheduleUpdate() {
    this.cancelUpdate();
    this.immediateId = setImmediate(() => {
      this.updateDiffs();
    });
  }

  cancelUpdate() {
    clearImmediate(this.immediateId);
  }

  updateDiffs() {
    if (!this.editor || this.editor.isDestroyed()) return;
    const path = this.editor.getPath();
    if (
      !path ||
      this.editor.getBuffer().getLength() > MAX_BUFFER_LENGTH_TO_DIFF
    ) {
      return;
    }

    let innerHTML;
    if (this.repository.isPathNew(path)) {
      innerHTML = `
        <span class="inline-block status-added">
          <span class="icon icon-diff-added"></span>${this.editor.getLineCount()}</span>
      `;
    } else if (this.repository.isPathIgnored(path)) {
      innerHTML = `
        <span class="inline-block status-ignored">
          <span class="icon icon-diff-added"></span>Ignored</span>
      `;
    } else {
      const diffs = this.repository.getLineDiffs(path, this.editor.getText());
      const { addedCount, modifiedCount, removedCount } = this.countDiffs(
        diffs
      );
      innerHTML = `
        <div class="inline-block">
          <span class="status-added">
            <span class="icon icon-diff-added"></span>${addedCount}</span>
          <span class="status-modified">
            <span class="icon icon-diff-modified"></span>${modifiedCount}</span>
          <span class="status-removed">
            <span class="icon icon-diff-removed"></span>${removedCount}</span>
        </div>
      `;
    }
    this.statusBarElement.innerHTML = innerHTML;
    this.statusBarElement.style.display = '';
  }

  countDiffs(diffs) {
    let addedCount = 0;
    let modifiedCount = 0;
    let removedCount = 0;
    diffs.forEach(diff => {
      const { oldLines, newLines } = diff;
      if (oldLines === 0) {
        addedCount += newLines;
      } else {
        modifiedCount += newLines;
        removedCount += oldLines;
      }
    });
    return { addedCount, modifiedCount, removedCount };
  }

  clear() {
    this.statusBarElement.innerHTML = '';
    this.statusBarElement.style.display = 'none';
    this.editorSubscriptions.dispose();
    this.repositorySubscriptions.dispose();
  }

  dispose() {
    this.editorSubscriptions.dispose();
    this.editorSubscriptions = null;
    this.repositorySubscriptions.dispose();
    this.repositorySubscriptions = null;
  }
}
