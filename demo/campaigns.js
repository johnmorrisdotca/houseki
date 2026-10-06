// Shared campaign presentation; rules and measured grades stay in the content manifest.
const bands = {
  entry: { en: 'Entry level', ja: '入門' },
  easy: { en: 'Easy', ja: '初級' },
  intermediate: { en: 'Intermediate', ja: '中級' },
  hard: { en: 'Hard', ja: '上級' },
  expert: { en: 'Expert', ja: '最上級' },
};
export function difficultyText(level) {
  return level.band ? `${level.score}/100` : `${level.marks}/5`;
}
export function levelText(level, lang) {
  return `${level.number} · ${difficultyText(level)} · ${level.title[lang]}`;
}
export function fillCampaignSelector(select, levels, lang, placeholder, legacy = []) {
  const selected = select.value;
  select.replaceChildren(new window.Option(placeholder, ''));
  const groups = new Map();
  for (const level of levels) {
    let parent = select;
    if (bands[level.band]) {
      if (!groups.has(level.band)) {
        const group = document.createElement('optgroup');
        group.label = bands[level.band][lang];
        groups.set(level.band, group); select.append(group);
      }
      parent = groups.get(level.band);
    }
    const option = new window.Option(levelText(level, lang), level.id);
    option.title = `${bands[level.band]?.[lang] ?? ''} ${option.textContent}`.trim();
    parent.append(option);
  }
  if (selected && !levels.some(level => level.id === selected)) {
    const old = legacy.find(level => level.id === selected);
    if (old) {
      const group = document.createElement('optgroup');
      group.label = lang === 'en' ? 'Earlier campaign' : '以前のキャンペーン';
      group.append(new window.Option(levelText(old, lang), old.id)); select.append(group);
    }
  }
  select.value = selected;
}
export function retainLegacyOption(select, level, lang) {
  if ([...select.options].some(option => option.value === level.id)) return;
  const option = new window.Option(levelText(level, lang), level.id);
  option.dataset.legacy = 'true'; select.append(option);
}
