# Krillion Spelling Helper

An independent browser extension that helps players spell an answer they already have in mind. It suggests words from a bundled English dictionary. It does not read questions, generate answers, or submit them.

## Downloads

| Browser | Store upload | Version |
| --- | --- | --- |
| Chrome | [Chrome Web Store package](https://github.com/jonramos9000-sudo/krillion-spelling-helper/releases/download/chrome-v1.1.2/krillion-spell-helper-chrome-store.zip) | 1.1.2 |
| Firefox | [AMO package](https://github.com/jonramos9000-sudo/krillion-spelling-helper/releases/download/firefox-v1.1.2/krillion-spell-helper-firefox.xpi) | 1.1.2 |

The releases are separated so players can download the package for their browser. Chrome Web Store uses a ZIP package; Firefox AMO uses an XPI package.

## Features

- Activates automatically on `https://krillion.io/`.
- On other pages, activate the helper from the extension toolbar button.
- Shows the five closest spelling suggestions first, with **See more** to reveal up to 30.
- Works offline using its included English dictionary.
- Uses a dark carbon theme and a krill icon.

## Privacy

The extension keeps spelling suggestions in the browser. It sends no typed text to a server, stores no typing history, and makes no network requests. On Krillion it reads only eligible text fields; elsewhere it runs only in a tab where the player turns it on.

## Source and development

- `source/common/` contains shared extension code, dictionary, icons, and the krill artwork source.
- `source/manifests/` and `source/readmes/` contain browser-specific files.
- `chrome/` and `firefox/` are unpacked browser folders for local installation or review.
- `packages/` contains the store-upload packages attached to the releases.

Rebuild from the shared source with Python 3: `python build.py 1.1.2`. The English frequency dictionary license is in `source/common/DICTIONARY-LICENSE.txt`.

Krillion Spelling Helper is a community-made extension. It is not affiliated with or endorsed by Krillion.
