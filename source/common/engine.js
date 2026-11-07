(() => {
  if (globalThis.KrillionSpelling) return;
  function sound(word) {
    return word.replace(/^pn/,'n').replace(/^kn/,'n').replace(/^wr/,'r').replace(/ph/g,'f').replace(/ght/g,'t').replace(/qu/g,'k').replace(/c(?=[eiy])/g,'s').replace(/[cq]/g,'k').replace(/[aeiouyh]/g,'').replace(/(.)\1+/g,'$1');
  }
  const words = globalThis.KrillionWords.split('\n').map((line, rank) => ({word: line, rank, sound: sound(line)}));
  const cache = new Map();
  function distance(a, b, limit = 2) {
    if (Math.abs(a.length - b.length) > limit) return limit + 1;
    let previousPrevious, previous = Array.from({length: b.length + 1}, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const row = [i];
      let min = i;
      for (let j = 1; j <= b.length; j++) {
        row[j] = Math.min(row[j - 1] + 1, previous[j] + 1, previous[j - 1] + (a[i - 1] !== b[j - 1]));
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) row[j] = Math.min(row[j], previousPrevious[j - 2] + 1);
        min = Math.min(min, row[j]);
      }
      if (min > limit) return limit + 1;
      previousPrevious = previous;
      previous = row;
    }
    return previous[b.length];
  }
  function suggest(raw) {
    const query = raw.toLowerCase();
    if (!/^[a-z]{2,30}$/.test(query)) return [];
    if (cache.has(query)) return cache.get(query);
    const found = [];
    const querySound = sound(query);
    for (const {word, rank, sound: wordSound} of words) {
      let score;
      if (word === query) score = -1;
      else if (word.startsWith(query)) score = 0.5 + (word.length - query.length) * 0.16 + Math.log10(rank + 10) * 0.22;
      else if (query.length >= 4 && querySound.length >= 3 && wordSound === querySound && Math.abs(word.length-query.length) <= 3) score = 0.7 + distance(query,word,3) * 0.22 + Math.log10(rank + 10) * 0.26;
      else {
        const limit = query.length < 4 ? 1 : 2;
        if (Math.abs(word.length - query.length) > limit) continue;
        const diff = distance(query, word, limit);
        if (diff > limit) continue;
        score = diff * 1.5 + Math.log10(rank + 10) * 0.26;
      }
      found.push({word, score});
    }
    const result = found.sort((a,b) => a.score - b.score).slice(0,30).map(item => item.word);
    if (cache.size > 150) cache.clear();
    cache.set(query, result);
    return result;
  }
  globalThis.KrillionSpelling = {suggest};
})();
