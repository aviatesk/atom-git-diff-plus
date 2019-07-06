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
      const { modified, removed } = this.makeDiffs(diffs);
      innerHTML = `
        <div class="inline-block">
          <span class="status-modified">
            <span class="icon icon-diff-modified"></span>${modified}</span>
          <span class="status-removed">
            <span class="icon icon-diff-removed"></span>${removed}</span>
        </div>
      `;
    }
    this.statusBarElement.innerHTML = innerHTML;
  }

  makeDiffs(diffs) {
    let modified = 0;
    let removed = 0;
    diffs.forEach(diff => {
      const { oldLines, newLines } = diff;
      if (newLines > oldLines) {
        modified += newLines - oldLines;
      } else {
        removed += oldLines;
      }
    });
    return { modified, removed };
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
