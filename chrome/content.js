(() => {
  if (globalThis.__krillionHelper) return globalThis.__krillionHelper.toggle();
  let enabled = true, field = null, suggestions = [], active = -1, expanded = false, range = null, timer, composing = false;
  const host = document.createElement('div');
  host.style.cssText = 'all:initial;position:fixed;inset:0 auto auto 0;z-index:2147483647;display:none;';
  const shadow = host.attachShadow({mode:'closed'});
  shadow.innerHTML = `<style>
    :host{color-scheme:dark}*{box-sizing:border-box}
    .box{width:100%;background:#191c1e;border:1px solid #3a4143;border-radius:13px;box-shadow:0 18px 42px #0009,0 1px 0 #ffffff12 inset;overflow:hidden;color:#e4e9e8;font:15px/1.4 system-ui,sans-serif;text-align:left}
    .label{padding:12px 15px 8px;background:repeating-linear-gradient(135deg,#ffffff04 0 1px,transparent 1px 5px),#202426;font-size:10px;font-weight:700;letter-spacing:1.6px;color:#aab5b4;text-transform:uppercase}
    [role=listbox]{max-height:min(320px,calc(100vh - 110px));overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#596466 #202426}
    button{display:flex;align-items:center;gap:11px;width:100%;border:0;background:#191c1e;padding:10px 15px;color:inherit;font:inherit;text-align:left;cursor:pointer}
    button:hover,button[aria-selected=true]{background:#2c3436;box-shadow:inset 3px 0 #81c9bc}button span{color:#7e9190;font-size:14px}strong{font-weight:650;color:#c6ede6}
    .more{justify-content:center;background:#252b2d;color:#c6ede6;font-size:12px;font-weight:650;border-top:1px solid #353c3e}.more:hover{background:#30393b}
    footer{padding:9px 15px;background:#202426;border-top:1px solid #353c3e;font-size:10px;color:#aab5b4}
  </style><div class="box"><div class="label">Spelling suggestions</div><div id="suggestion-options" role="listbox" aria-label="Spelling suggestions"></div><button class="more" type="button" aria-controls="suggestion-options" aria-expanded="false" hidden></button><footer>↑ ↓ to choose · Enter to use · Esc to close</footer></div>`;
  document.documentElement.append(host);
  const list = shadow.querySelector('[role=listbox]');
  const moreButton = shadow.querySelector('.more');
  moreButton.addEventListener('mousedown', event => event.preventDefault());
  moreButton.addEventListener('click', () => {
    expanded = !expanded;
    render();
    position();
  });
  function hide() { host.style.display = 'none'; active = -1; suggestions = []; }
  function eligible(el) {
    return (el instanceof HTMLTextAreaElement || (el instanceof HTMLInputElement && ['text','search'].includes(el.type))) && !el.disabled && !el.readOnly && !/(password|secret|credit|card|token|cc-)/i.test([el.name, el.id, el.autocomplete].join(' '));
  }
  function token(el) {
    const pos = el.selectionStart;
    if (pos === null || pos !== el.selectionEnd) return null;
    const before = el.value.slice(0,pos).match(/[a-zA-Z]+$/);
    if (!before) return null;
    const after = el.value.slice(pos).match(/^[a-zA-Z]*/)[0];
    return {start:pos-before[0].length, end:pos+after.length, word:before[0]+after};
  }
  function position() {
    if (!field || host.style.display === 'none') return;
    const rect = field.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) { hide(); return; }
    const width = Math.min(Math.max(rect.width,270),360,innerWidth-16);
    host.style.width = width+'px';
    host.style.left = Math.max(8, Math.min(rect.left,innerWidth-width-8))+'px';
    const height = host.getBoundingClientRect().height;
    host.style.top = Math.max(8, rect.bottom+8+height > innerHeight && rect.top-height-8 >= 8 ? rect.top-height-8 : Math.min(rect.bottom+8,innerHeight-height-8))+'px';
  }
  function casing(word) {
    if (range.word === range.word.toUpperCase()) return word.toUpperCase();
    return /^[A-Z]/.test(range.word) ? word[0].toUpperCase()+word.slice(1) : word;
  }
  function render() {
    const count = expanded ? suggestions.length : Math.min(5,suggestions.length);
    list.replaceChildren();
    suggestions.slice(0,count).forEach((word,index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.tabIndex = -1; button.setAttribute('role','option'); button.setAttribute('aria-label',word); button.setAttribute('aria-selected',String(index===active));
      const icon = document.createElement('span'); icon.textContent = '↳'; button.append(icon);
      const label = document.createElement('strong'); label.textContent = word; button.append(label);
      button.addEventListener('mousedown', e => {e.preventDefault(); choose(index);});
      list.append(button);
    });
    moreButton.hidden = suggestions.length <= 5;
    moreButton.textContent = expanded ? 'Show fewer suggestions' : `See more suggestions (${suggestions.length-5})`;
    moreButton.setAttribute('aria-expanded',String(expanded));
  }
  function update() {
    if (!enabled || composing || !eligible(document.activeElement)) return hide();
    field = document.activeElement;
    range = token(field);
    if (!range || range.word.length < 2) return hide();
    suggestions = globalThis.KrillionSpelling.suggest(range.word).map(casing);
    if (!suggestions.length) return hide();
    active = -1; expanded = false;
    host.style.display = 'block'; render(); position();
  }
  function choose(index) {
    if (!field || !range || !suggestions[index]) return;
    if (document.activeElement !== field || token(field)?.word !== range.word) return hide();
    const el = field, word = suggestions[index];
    const value = el.value.slice(0,range.start)+word+el.value.slice(range.end);
    const cursor = range.start+word.length;
    const descriptor = Object.getOwnPropertyDescriptor(el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,'value');
    const before = new InputEvent('beforeinput',{bubbles:true,cancelable:true,inputType:'insertReplacementText',data:word});
    if (!el.dispatchEvent(before)) return hide();
    descriptor.set.call(el,value);
    el.setSelectionRange(cursor,cursor);
    hide();
    el.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertReplacementText',data:word}));
    clearTimeout(timer);
  }
  document.addEventListener('input', event => {
    if (!eligible(event.target)) return;
    hide(); clearTimeout(timer); if (!composing) timer = setTimeout(update,140);
  },true);
  document.addEventListener('focusin', () => {hide(); clearTimeout(timer);},true);
  document.addEventListener('focusout',hide,true);
  document.addEventListener('compositionstart',() => {composing=true;hide();},true);
  document.addEventListener('compositionend',() => {composing=false;clearTimeout(timer);timer=setTimeout(update,140);},true);
  document.addEventListener('pointerdown',event => {if (!event.composedPath().includes(host)) hide();},true);
  document.addEventListener('keydown',event => {
    if (event.target !== field || host.style.display === 'none' || event.isComposing) return;
    if (['ArrowDown','ArrowUp'].includes(event.key)) {
      event.preventDefault(); event.stopImmediatePropagation();
      let visibleCount = expanded ? suggestions.length : Math.min(5,suggestions.length);
      if (event.key === 'ArrowDown' && active === visibleCount-1 && !expanded && suggestions.length > visibleCount) {
        expanded = true;
        render();
        visibleCount = suggestions.length;
      }
      active = event.key === 'ArrowDown'
        ? (active + 1) % visibleCount
        : (active === -1 ? visibleCount - 1 : (active - 1 + visibleCount) % visibleCount);
      [...list.children].forEach((button,i) => button.setAttribute('aria-selected',String(i===active)));
      list.children[active]?.scrollIntoView({block:'nearest'});
    } else if (event.key === 'Enter' && active >= 0) {event.preventDefault();event.stopImmediatePropagation();choose(active);}
    else if (['Escape','Tab','ArrowLeft','ArrowRight','Home','End'].includes(event.key)) hide();
  },true);
  window.addEventListener('resize',position);
  window.addEventListener('scroll',position,true);
  globalThis.__krillionHelper = {toggle() { enabled = !enabled; hide();clearTimeout(timer);return enabled; }};
  return enabled;
})();
