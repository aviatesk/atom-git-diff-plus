/** @babel */

import { CompositeDisposable, Point, Range } from 'atom';

import { MAX_BUFFER_LENGTH_TO_DIFF, repositoryForEditor } from './helpers';

export default class GitDiffView {
  constructor(editor) {
    this.editor = editor;
    this.subscriptions = new CompositeDisposable();
    this.decorations = {};
    this.markers = [];
  }

  async start() {
    const editorElement = this.editor.getElement();

    await this.subscribeToRepository();

    this.subscriptions.add(
      this.editor.onDidStopChanging(() => {
        this.updateDiffs();
      }),
      this.editor.onDidChangePath(() => {
        this.subscribeToRepository();
      }),
      atom.project.onDidChangePaths(async _paths => {
        // update repository after a current project has been changed: https://github.com/aviatesk/atom-git-diff-plus/issues/12
        await this.subscribeToRepository();
      }),
      atom.config.onDidChange('git-diff-plus.showIconsInEditorGutter', () => {
        this.updateIconDecoration();
      }),
      atom.config.onDidChange('editor.showLineNumbers', () => {
        this.updateIconDecoration();
      }),
      editorElement.onDidAttach(() => {
        this.updateIconDecoration();
      }),
      atom.commands.add(
        editorElement,
        'git-diff-plus:move-to-previous-diff',
        () => {
          this.moveToPreviousDiff();
        }
      ),
      atom.commands.add(
        editorElement,
        'git-diff-plus:move-to-next-diff',
        () => {
          this.moveToNextDiff();
        }
      ),
      this.editor.onDidDestroy(() => {
        this.cancelUpdate();
        this.removeDecorations();
        this.subscriptions.dispose();
        this.subscriptions = null;
      })
    );

    this.updateIconDecoration();
    this.scheduleUpdate();
  }

  updateDiffs() {
    if (this.editor.isDestroyed()) return;
    this.removeDecorations();
    const path = this.editor.getPath();
    if (
      !path ||
      this.editor.getBuffer().getLength() > MAX_BUFFER_LENGTH_TO_DIFF
    ) {
      return;
    }
    this.diffs =
      this.repository &&
      this.repository.getLineDiffs(path, this.editor.getText());
    if (this.diffs) this.addDecorations(this.diffs);
  }

  removeDecorations() {
    this.markers.forEach(marker => {
      marker.destroy();
    });
  }

  addDecorations(diffs) {
    diffs.forEach(diff => {
      const { newStart, oldLines, newLines } = diff;
      const startRow = newStart - 1;
      const endRow = newStart + newLines - 1;
      if (oldLines === 0 && newLines > 0) {
        this.markRange(startRow, endRow, 'git-line-added');
      } else if (newLines === 0 && oldLines > 0) {
        if (startRow < 0) {
          this.markRange(0, 0, 'git-previous-line-removed');
        } else {
          this.markRange(startRow, startRow, 'git-line-removed');
        }
      } else {
        this.markRange(startRow, endRow, 'git-line-modified');
      }
    });
  }

  markRange(startRow, endRow, klass) {
    const start = new Point(startRow, 0);
    const end = new Point(endRow, 0);
    const range = new Range(start, end);
    const marker = this.editor.markBufferRange(range, {
      invalidate: 'never'
    });
    this.editor.decorateMarker(marker, { type: 'line-number', class: klass });
    this.markers.push(marker);
  }

  async subscribeToRepository() {
    const repository = await repositoryForEditor(this.editor);
    if (!repository) return;
    this.repository = repository;
    this.subscriptions.add(
      this.repository.onDidChangeStatuses(() => {
        this.scheduleUpdate();
      }),
      this.repository.onDidChangeStatus(event => {
        if (event.path === this.editor.getPath()) {
          this.scheduleUpdate();
        }
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

  updateIconDecoration() {
    const gutter = this.editor
      .getElement()
      .querySelector('.gutter.line-numbers'); // @NOTE: Atom-IDE-UI also creates `.gutter` element
    if (gutter) {
      if (
        atom.config.get('editor.showLineNumbers') &&
        atom.config.get('git-diff-plus.showIconsInEditorGutter')
      ) {
        gutter.classList.add('git-diff-plus-icon');
      } else {
        gutter.classList.remove('git-diff-plus-icon');
      }
    }
  }

  moveToPreviousDiff() {
    const cursorLineNumber = this.editor.getCursorBufferPosition().row + 1;
    let previousDiffLineNumber = -1;
    let lastDiffLineNumber = -1;
    if (this.diffs) {
      this.diffs.forEach(({ newStart }) => {
        if (newStart < cursorLineNumber) {
          previousDiffLineNumber = Math.max(
            newStart - 1,
            previousDiffLineNumber
          );
        }
        lastDiffLineNumber = Math.max(newStart - 1, lastDiffLineNumber);
      });
    }

    // Wrap around to the last diff in the file
    if (
      atom.config.get('git-diff-plus.wrapAroundOnMoveToDiff') &&
      previousDiffLineNumber === -1
    ) {
      previousDiffLineNumber = lastDiffLineNumber;
    }

    this.moveToLineNumber(previousDiffLineNumber);
  }

  moveToNextDiff() {
    const cursorLineNumber = this.editor.getCursorBufferPosition().row + 1;
    let nextDiffLineNumber = null;
    let firstDiffLineNumber = null;
    if (this.diffs) {
      this.diffs.forEach(({ newStart }) => {
        if (newStart > cursorLineNumber) {
          if (nextDiffLineNumber == null) nextDiffLineNumber = newStart - 1;
          nextDiffLineNumber = Math.min(newStart - 1, nextDiffLineNumber);
        }

        if (firstDiffLineNumber == null) firstDiffLineNumber = newStart - 1;
        firstDiffLineNumber = Math.min(newStart - 1, firstDiffLineNumber);
      });
    }

    // Wrap around to the first diff in the file
    if (
      atom.config.get('git-diff-plus.wrapAroundOnMoveToDiff') &&
      nextDiffLineNumber == null
    ) {
      nextDiffLineNumber = firstDiffLineNumber;
    }

    this.moveToLineNumber(nextDiffLineNumber);
  }

  moveToLineNumber(lineNumber) {
    if (lineNumber != null && lineNumber >= 0) {
      const position = new Point(lineNumber, 0);
      this.editor.setCursorBufferPosition(position);
      this.editor.moveToFirstCharacterOfLine();
    }
  }
}
