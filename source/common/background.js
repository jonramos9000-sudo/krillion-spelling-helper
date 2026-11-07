const extensionApi = globalThis.browser ?? globalThis.chrome;

extensionApi.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  try {
    const results = await extensionApi.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['words.js', 'engine.js', 'content.js']
    });
    const enabled = results[0]?.result === true;
    await extensionApi.action.setBadgeText({tabId: tab.id, text: enabled ? 'ON' : ''});
    await extensionApi.action.setBadgeBackgroundColor({tabId: tab.id, color: '#3a4749'});
    await extensionApi.action.setTitle({tabId: tab.id, title: enabled ? 'Spelling helper on · Click to turn off' : 'Turn spelling suggestions on for this page'});
  } catch (error) {
    console.error('Could not activate Krillion Spelling Helper on this tab.', error);
    await extensionApi.action.setBadgeText({tabId: tab.id, text: '!'});
    await extensionApi.action.setTitle({tabId: tab.id, title: 'Open a regular website, then try again.'});
  }
});
extensionApi.tabs.onUpdated.addListener(async (tabId, change, tab) => {
  if (change.status === 'loading') {
    await extensionApi.action.setBadgeText({tabId, text: ''});
    return;
  }
  if (change.status !== 'complete') return;
  const autoEnabled = tab.url ? new URL(tab.url).hostname === 'krillion.io' : false;
  await extensionApi.action.setBadgeText({tabId, text: autoEnabled ? 'ON' : ''});
  await extensionApi.action.setBadgeBackgroundColor({tabId, color: '#3a4749'});
  await extensionApi.action.setTitle({tabId, title: autoEnabled ? 'Spelling helper automatically on for Krillion' : 'Click to turn spelling suggestions on for this page'});
});
