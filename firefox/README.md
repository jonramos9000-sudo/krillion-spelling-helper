# Krillion Spelling Helper for Firefox

Type an approximate spelling in a regular answer box, then pick from the five closest suggestions. Click **See more suggestions** to reveal the full list of up to 30; scroll the dropdown to browse. Suggestions work offline.

## Load in Firefox

1. Download and extract `krillion-spell-helper-firefox.zip`.
2. In Firefox, open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on…**.
4. Select the extracted `manifest.json` file.
5. Visit [krillion.io](https://krillion.io/); suggestions turn on automatically there. On other sites, open Firefox's Extensions menu and click **Krillion · Spelling Helper** to enable it for that tab.
6. Type at least two letters into a regular text answer field and choose a suggestion. On Krillion, the badge shows **ON** automatically. Click the helper icon again to turn suggestions off for that tab.

Firefox temporary add-ons are removed when Firefox closes or restarts. To use this extension after a restart, load the temporary add-on again from `about:debugging`.

For a quick demo, open `demo.html` in Firefox; it enables suggestions automatically.

For an AMO submission, upload the `.xpi` package. Its ZIP contents have `manifest.json` at the archive root.

## Privacy and compatibility

The English dictionary is bundled, so lookup is offline. The extension sends no typing to a server and saves no typing history. It runs automatically on `krillion.io`; for other sites, it runs only in a tab where you click its toolbar button. It supports ordinary text and search inputs and textareas. Password and payment fields, email inputs, rich text editors, iframes, and fields inside shadow roots are excluded. Unusual names and specialist words may not appear.

Dictionary source and license: `DICTIONARY-LICENSE.txt`.
