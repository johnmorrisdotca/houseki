// The words the family's header and footer say on each page of the demo, in both languages. A page's script
// hands its page's table to `familyLanguage`, and scripts/site.mjs builds the pages from the same table.
export const PAGES = {
  triplets: {
    file: "index.html",
    link: { en: "Falling Triplets", ja: "三つの宝石" },
    title: "Houseki · gem and stone puzzle games",
    description: "Play Houseki's Falling Triplets: cycle a falling vertical triplet of gems and line up three, in relaxed, arcade and daily modes, with graded challenges and lessons, in English and Japanese. Free and open source, for a phone or a desk.",
    foot: { en: "Falling Triplets · relaxed planning · arcade timing · daily and witnessed challenges", ja: "三つの宝石 · じっくり考える · 時間で落ちる · 毎日のチャレンジ" },
    status: { en: "100 graded challenges · three interactive lessons.", ja: "100のチャレンジ · 3つのレッスン。" },
  },
  chains: {
    file: "chains.html",
    link: { en: "Colour Chains", ja: "色の連鎖" },
    title: "Houseki · Colour Chains",
    description: "Play Colour Chains, a falling-pairs gem game: rotate the pair, connect four of one colour and set off cascading chains, with optional magnetic stones and weather. Graded challenges, in English and Japanese, free and open source.",
    foot: { en: "Colour Chains · Shizen and Arashi campaigns · relaxed, arcade and daily play", ja: "色の連鎖 · 自然と嵐のキャンペーン · じっくり考える・時間で落ちる・毎日のチャレンジ" },
    status: { en: "150 graded challenges · Colour Chains, Shizen and Arashi.", ja: "150のチャレンジ · 色の連鎖・自然・嵐。" },
  },
  tools: {
    file: "tools.html",
    link: { en: "Gem Swap & Stone Collapse", ja: "ジェムスワップ・ストーンコラプス" },
    title: "Houseki · Gem Swap and Stone Collapse",
    description: "Play Gem Swap and Stone Collapse on full boards with stored tools: swap neighbours to make specials, or select connected stones and plan the order they leave. Graded challenges, in English and Japanese, free and open source.",
    foot: { en: "Gem Swap and Stone Collapse · full boards, stored tools and careful choices", ja: "ジェムスワップとストーンコラプス · 盤面いっぱいの石と、便利な道具" },
    status: { en: "150 graded challenges · Gem Swap and Stone Collapse.", ja: "150のチャレンジ · ジェムスワップ・ストーンコラプス。" },
  },
  blocks: {
    file: "blocks.html",
    link: { en: "Magnetic Blocks", ja: "磁石ブロック" },
    title: "Houseki · Magnetic Blocks",
    description: "Play Magnetic Blocks, a falling-blocks game with bonded 2×2 squares, a floor that turns magnetic on a schedule, a one-use Floor Switch and magnetic impact drops. In English and Japanese, free and open source.",
    foot: { en: "Magnetic Blocks · relaxed planning · arcade timing · Calm and Pull floor rules", ja: "磁石ブロック · じっくり考える · 時間で落ちる · 「穏やか」と「引き寄せ」の床" },
    status: { en: "50 graded challenges · bonded squares, Calm and Pull floors.", ja: "50のチャレンジ · 結合したブロック・静穏と引力の床。" },
  },
};

const SHARED = {
  en: {
    pitch: "Original gem and stone puzzle games: careful rules, tactile materials, and boards that suit a phone or a desk.",
    name: "Houseki (宝石) is Japanese for a gem or precious stone.",
    nameLink: "The name",
    pageApi: "API reference",
    games: "Game",
  },
  ja: {
    pitch: "宝石と石のオリジナルパズルゲーム。ていねいに作ったルールと手ざわりのある素材で、スマートフォンでもパソコンでも遊べます。",
    name: "宝石（ほうせき）は、宝石や貴石を意味する日本語です。",
    nameLink: "名前について",
    pageApi: "API リファレンス",
    games: "ゲーム",
  },
};

/** The table `familyLanguage` takes for a page: the words every page shares, the page's own foot and status, and a name for each game page. */
export function pageWords(page) {
  const words = {};
  for (const lang of ["en", "ja"]) {
    words[lang] = { ...SHARED[lang], foot: PAGES[page].foot[lang], status: PAGES[page].status[lang] };
    for (const [key, one] of Object.entries(PAGES)) words[lang][`page_${key}`] = one.link[lang];
  }
  return words;
}
