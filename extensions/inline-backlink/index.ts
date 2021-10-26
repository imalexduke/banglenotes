import { wikiLink, wikiLinkMarkdownItPlugin } from '@bangle.dev/wiki-link';

import { Extension } from '@bangle.io/extension-registry';
import { inlinePalette } from '@bangle.io/inline-palette';

import { extensionName, paletteMark, palettePluginKey } from './config';
import { renderReactNodeView } from './editor/BackLinkNode';
import { inlineBackLinkPlugin } from './editor/inline-backlink-plugin';
import { InlineBacklinkPalette } from './editor/InlineBacklinkPalette';

const getScrollContainer = (view) => {
  return view.dom.parentElement;
};

const extension = Extension.create({
  name: extensionName,
  editor: {
    specs: [
      wikiLink.spec(),
      inlinePalette.spec({
        markName: paletteMark,
        trigger: '[[',
      }),
    ],
    highPriorityPlugins: [
      inlinePalette.plugins({
        key: palettePluginKey,
        markName: paletteMark,
        tooltipRenderOpts: {
          getScrollContainer,
        },
      }),
    ],
    plugins: [inlineBackLinkPlugin()],
    markdownItPlugins: [wikiLinkMarkdownItPlugin],
    ReactComponent: InlineBacklinkPalette,
    renderReactNodeView: renderReactNodeView,
  },
});

export default extension;
