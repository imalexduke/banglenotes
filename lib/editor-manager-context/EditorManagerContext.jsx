import React, { useContext, useEffect, useState, useMemo } from 'react';
import { config } from 'config/index';
import { getIdleCallback } from '@bangle.dev/core/utils/js-utils';
import { UIManagerContext } from 'ui-context/index';

const LOG = false;
let log = LOG ? console.log.bind(console, 'EditorManager') : () => {};

const maxEditors = [undefined, undefined];
const MAX_EDITOR = maxEditors.length;

export const EditorManagerContext = React.createContext({});

/**
 * Should be parent of all editors.
 */
export function EditorManager({ bangleIOContext, children }) {
  /**
   * Understanding common loading patterns
   *
   * # Opening an Existing file
   *
   * 1. User somehow clicks on a file and triggers pushWsPath
   * 2. That then becomes a wsPath derived from history.location
   * 3. A <Editor /> gets mounted with new wsPath
   * 4. At this point the editor is loaded with empty doc.
   * 5. Collab-extension's collab-client sets up communication with worker thread.
   * 6. Worker thread has a collab-manager instance running.
   * 7. When collab-client calls getDocument, it is passed on to worker thread's manager
   * 8. manager calls localDisk.getItem to get the document from indexdb.
   * 9. Collab-client plugin refreshes the editor with correct content
   */
  const [editors, _setEditor] = useState(maxEditors);
  const [primaryEditor, secondaryEditor] = editors;
  const { paletteType } = useContext(UIManagerContext);
  const value = useMemo(() => {
    const setEditor = (editorId, editor) => {
      _setEditor((array) => {
        if (editorId > MAX_EDITOR) {
          throw new Error(`Only ${MAX_EDITOR + 1} allowed`);
        }
        const newArray = array.slice(0);
        newArray[editorId] = editor;
        return newArray;
      });
    };

    const [primaryEditor] = editors;
    const getEditor = (editorId) => {
      return editors[editorId];
    };

    return {
      setEditor,
      primaryEditor,
      getEditor,
      bangleIOContext,
    };
  }, [_setEditor, bangleIOContext, editors]);

  useEffect(() => {
    if (!paletteType) {
      rafEditorFocus(primaryEditor);
    }
  }, [paletteType, primaryEditor]);

  useEffect(() => {
    if (!paletteType) {
      rafEditorFocus(secondaryEditor);
    }
    return () => {};
  }, [paletteType, secondaryEditor]);

  useEffect(() => {
    if (!config.isIntegration) {
      window.primaryEditor = editors[0];
      window.secondaryEditor = editors[1];
      getIdleCallback(() => {
        if (
          new URLSearchParams(window.location.search).get('debug_pm') ===
            'yes' &&
          editors[0]
        ) {
          import(
            /* webpackChunkName: "prosemirror-dev-tools" */ 'prosemirror-dev-tools'
          ).then((args) => {
            args.applyDevTools(editors[0].view);
          });
        }
      });
    }
  }, [editors]);

  return (
    <EditorManagerContext.Provider value={value}>
      {children}
    </EditorManagerContext.Provider>
  );
}

function rafEditorFocus(editor) {
  if (editor && !editor.view.hasFocus()) {
    requestAnimationFrame(() => {
      editor.view.focus();
    });
  }
}
