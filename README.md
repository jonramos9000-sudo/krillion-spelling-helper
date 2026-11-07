# Krillion Spelling Helper

An independent browser extension that helps players spell an answer they already have in mind. It suggests words from a bundled English dictionary. It does not read questions, generate answers, or submit them.

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
