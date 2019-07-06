const path = require('path');
const fs = require('fs-plus');
const temp = require('temp');

describe('Git-Diff-Plus package', () => {
  let editor, editorElement, projectPath, outsideProjectPath, ELAPSEDTIME;

  beforeEach(async () => {
    projectPath = temp.mkdirSync('git-diff-plus-spec-');
    outsideProjectPath = temp.mkdirSync('git-diff-plus-spec-');
    const otherPath = temp.mkdirSync('some-other-path-');

    fs.copySync(path.join(__dirname, 'fixtures', 'working-dir'), projectPath);
    fs.moveSync(
      path.join(projectPath, 'git.git'),
      path.join(projectPath, '.git')
    );
    fs.copySync(
      path.join(__dirname, 'fixtures', 'non-working-dir'),
      outsideProjectPath
    );
    fs.moveSync(
      path.join(outsideProjectPath, 'git.git'),
      path.join(outsideProjectPath, '.git')
    );
    atom.project.setPaths([otherPath, projectPath]);

    jasmine.attachToDOM(atom.workspace.getElement());

    await atom.workspace.open(path.join(projectPath, 'sample.js'));
    runs(() => {
      editor = atom.workspace.getActiveTextEditor();
      editorElement = editor.getElement();
      ELAPSEDTIME = editor.getBuffer().getStoppedChangingDelay();
    });

    await atom.packages.activatePackage('git-diff-plus');
  });

  describe('when the editor has modified lines', () => {
    it('highlights the modified lines', () => {
      expect(editorElement.querySelectorAll('.git-line-modified').length).toBe(
        0
      );
      editor.insertText('a');
      setTimeout(() => {
        expect(
          editorElement.querySelectorAll('.git-line-modified').length
        ).toBe(1);
        expect(editorElement.querySelector('.git-line-modified')).toHaveData(
          'buffer-row',
          0
        );
      }, ELAPSEDTIME);
    });
  });

  describe('when the editor has added lines', () => {
    it('highlights the added lines', () => {
      expect(editorElement.querySelectorAll('.git-line-added').length).toBe(0);

      editor.moveToEndOfLine();
      editor.insertNewline();
      editor.insertText('a');
      setTimeout(() => {
        expect(editorElement.querySelectorAll('.git-line-added').length).toBe(
          1
        );
        expect(editorElement.querySelector('.git-line-added')).toHaveData(
          'buffer-row',
          1
        );
      }, ELAPSEDTIME);
    });
  });

  describe('when the editor has removed lines', () => {
    it('highlights the line preceeding the deleted lines', () => {
      expect(editorElement.querySelectorAll('.git-line-added').length).toBe(0);

      editor.setCursorBufferPosition([5]);
      editor.deleteLine();
      setTimeout(() => {
        expect(editorElement.querySelectorAll('.git-line-removed').length).toBe(
          1
        );
        expect(editorElement.querySelector('.git-line-removed')).toHaveData(
          'buffer-row',
          4
        );
      }, ELAPSEDTIME);
    });
  });

  describe('when the editor has removed the first line', () => {
    it('highlights the line preceeding the deleted lines', () => {
      expect(editorElement.querySelectorAll('.git-line-added').length).toBe(0);

      editor.setCursorBufferPosition([0, 0]);
      editor.deleteLine();
      setTimeout(() => {
        expect(
          editorElement.querySelectorAll('.git-previous-line-removed').length
        ).toBe(1);
        expect(
          editorElement.querySelector('.git-previous-line-removed')
        ).toHaveData('buffer-row', 0);
      }, ELAPSEDTIME);
    });
  });

  describe('when a modified line is restored to the HEAD version contents', () => {
    it('removes the diff highlight', () => {
      expect(editorElement.querySelectorAll('.git-line-modified').length).toBe(
        0
      );

      editor.insertText('a');
      setTimeout(() => {
        expect(
          editorElement.querySelectorAll('.git-line-modified').length
        ).toBe(1);
      }, ELAPSEDTIME);

      editor.backspace();
      setTimeout(() => {
        expect(
          editorElement.querySelectorAll('.git-line-modified').length
        ).toBe(0);
      }, ELAPSEDTIME);
    });
  });

  describe('when a modified file is opened', () => {
    it('highlights the changed lines', async () => {
      fs.writeFileSync(
        path.join(projectPath, 'sample.txt'),
        'Some different text.'
      );

      await atom.workspace.open(path.join(projectPath, 'sample.txt'));
      editorElement = atom.workspace.getActiveTextEditor().getElement();

      setTimeout(() => {
        expect(
          editorElement.querySelectorAll('.git-line-modified').length
        ).toBe(1);
        expect(editorElement.querySelector('.git-line-modified')).toHaveData(
          'buffer-row',
          0
        );
      }, ELAPSEDTIME);
    });
  });

  describe('when a modified file outside of the current project is opened', () => {
    it('still highlights the changed lines', async () => {
      fs.writeFileSync(
        path.join(outsideProjectPath, 'sample-outside-project.txt'),
        'Some different text.'
      );

      await atom.workspace.open(
        path.join(outsideProjectPath, 'sample-outside-project.txt')
      );
      editor = atom.workspace.getActiveTextEditor();
      editorElement = editor.getElement();

      setTimeout(() => {
        expect(
          editorElement.querySelectorAll('.git-line-modified').length
        ).toBe(1);
        expect(editorElement.querySelector('.git-line-modified')).toHaveData(
          'buffer-row',
          0
        );
      }, ELAPSEDTIME);
    });
  });

  describe('when the project paths change', () => {
    it("doesn't try to use the destroyed git repository", () => {
      editor.deleteLine();
      atom.project.setPaths([temp.mkdirSync('no-repository')]);
      advanceClock(editor.getBuffer().stoppedChangingDelay);
    });
  });

  describe('move-to-next-diff/move-to-previous-diff events', () => {
    it('moves the cursor to first character of the next/previous diff line', () => {
      editor.insertText('a');
      editor.setCursorBufferPosition([5]);
      editor.deleteLine();
      setTimeout(() => {
        editor.setCursorBufferPosition([0]);
        atom.commands.dispatch(editorElement, 'git-diff:move-to-next-diff');
        expect(editor.getCursorBufferPosition()).toEqual([4, 4]);

        atom.commands.dispatch(editorElement, 'git-diff:move-to-previous-diff');
        expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
      }, ELAPSEDTIME);
    });

    it('wraps around to the first/last diff in the file', () => {
      editor.insertText('a');
      editor.setCursorBufferPosition([5]);
      editor.deleteLine();
      setTimeout(() => {
        editor.setCursorBufferPosition([0]);
        atom.commands.dispatch(editorElement, 'git-diff:move-to-next-diff');
        expect(editor.getCursorBufferPosition()).toEqual([4, 4]);

        atom.commands.dispatch(editorElement, 'git-diff:move-to-next-diff');
        expect(editor.getCursorBufferPosition()).toEqual([0, 0]);

        atom.commands.dispatch(editorElement, 'git-diff:move-to-previous-diff');
        expect(editor.getCursorBufferPosition()).toEqual([4, 4]);
      }, ELAPSEDTIME);
    });

    describe('when the wrapAroundOnMoveToDiff config option is false', () => {
      beforeEach(() =>
        atom.config.set('git-diff.wrapAroundOnMoveToDiff', false)
      );

      it('does not wraps around to the first/last diff in the file', () => {
        editor.insertText('a');
        editor.setCursorBufferPosition([5]);
        editor.deleteLine();
        setTimeout(() => {
          editor.setCursorBufferPosition([0]);
          atom.commands.dispatch(editorElement, 'git-diff:move-to-next-diff');
          expect(editor.getCursorBufferPosition()).toEqual([4, 4]);

          atom.commands.dispatch(editorElement, 'git-diff:move-to-next-diff');
          expect(editor.getCursorBufferPosition()).toEqual([4, 4]);

          atom.commands.dispatch(
            editorElement,
            'git-diff:move-to-previous-diff'
          );
          expect(editor.getCursorBufferPosition()).toEqual([0, 0]);

          atom.commands.dispatch(
            editorElement,
            'git-diff:move-to-previous-diff'
          );
          expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        }, ELAPSEDTIME);
      });
    });
  });

  describe('when the showIconsInEditorGutter config option is true', () => {
    beforeEach(() => {
      atom.config.set('git-diff.showIconsInEditorGutter', true);
    });

    it('the gutter has a git-diff-icon class', () => {
      setTimeout(() => {
        expect(editorElement.querySelector('.gutter')).toHaveClass(
          'git-diff-icon'
        );
      }, ELAPSEDTIME);
    });

    it('keeps the git-diff-icon class when editor.showLineNumbers is toggled', () => {
      atom.config.set('editor.showLineNumbers', false);
      setTimeout(() => {
        expect(editorElement.querySelector('.gutter')).not.toHaveClass(
          'git-diff-icon'
        );
      }, ELAPSEDTIME);

      atom.config.set('editor.showLineNumbers', true);
      setTimeout(() => {
        expect(editorElement.querySelector('.gutter')).toHaveClass(
          'git-diff-icon'
        );
      }, ELAPSEDTIME);
    });

    it('removes the git-diff-icon class when the showIconsInEditorGutter config option set to false', () => {
      atom.config.set('git-diff.showIconsInEditorGutter', false);
      setTimeout(() => {
        expect(editorElement.querySelector('.gutter')).not.toHaveClass(
          'git-diff-icon'
        );
      }, ELAPSEDTIME);
    });
  });
});
