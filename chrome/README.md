# Krillion Spelling Helper

Type an approximate spelling in an answer box, then pick from the five closest suggestions. Click **See more suggestions** to reveal the full list of up to 30; scroll the dropdown to browse. The helper also completes partial words. It does not read questions or generate answers.

## Install in Chrome

1. Extract the ZIP. It contains a `chrome` folder.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** at the top right.
4. Click **Load unpacked**, then select the `chrome` folder containing `manifest.json`.
5. Visit [krillion.io](https://krillion.io/); suggestions turn on automatically there. Click the extension icon on other sites to enable suggestions for that tab.

The toolbar badge says **ON** while active. Click again to turn it off. Reloading a page turns it off; click the icon again to enable it.

## Use

Type at least two letters into a normal text answer box. Click a suggestion, or press the down arrow to select one and Enter to insert it. Escape closes the dropdown. Enter accepts a suggestion only after you select one with the arrow keys. The helper never submits an answer automatically.

For a quick trial, open `demo.html` in Chrome after extracting. The demo enables suggestions automatically, without installing the extension.

## Privacy and compatibility

All suggestions come from the bundled English dictionary. No accounts, server, analytics, network requests, or saved typing history. The extension runs automatically on `krillion.io` and requests `activeTab` access when you turn it on for other tabs.

Supports normal text/search inputs and textareas, including many React forms. Password fields, payment fields, email inputs, rich text editors, iframes, and inputs inside shadow roots are excluded. Chrome does not permit extensions on its settings pages or the Chrome Web Store. The dictionary is approximate: unusual names, specialist vocabulary, and spellings very different from the intended word may not appear. The actual Krillion website was not supplied, so its answer fields have not been checked directly.

Dictionary source and license are in `DICTIONARY-LICENSE.txt`.
