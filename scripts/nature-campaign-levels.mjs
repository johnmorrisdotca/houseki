export { arashiConstructionBlueprints } from "./nature-campaign/arashi-construction-blueprints.data.mjs";
export { arashiGuardGatePrototypes } from "./nature-campaign/arashi-guard-gate-prototypes.data.mjs";
export {
  arashiCausalPrototype,
  arashiThreeTargetPrototype,
} from "./nature-campaign/arashi-prototypes.data.mjs";
export { arashiTallTowerPrototypes } from "./nature-campaign/arashi-tall-tower-prototypes.data.mjs";
export { arashiWideGuardPrototypes } from "./nature-campaign/arashi-wide-guard-prototypes.data.mjs";
export { shizenConstructionBlueprints } from "./nature-campaign/shizen-construction-blueprints.data.mjs";
export {
  advancedShizenPrototypes,
  shizenFourWaveLayouts,
  shizenFourWaveRestorePrototype,
} from "./nature-campaign/shizen-prototypes.data.mjs";

export async function generateNatureCampaigns() {
  const { generateContent } = await import("./colour-chains-levels.mjs");
  const data = generateContent();
  return { shizen: data.shizen, arashi: data.arashi };
}

if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  const { generateContent } = await import("./colour-chains-levels.mjs");
  const { writeFile } = await import("node:fs/promises");
  const data = generateContent();
  const output =
    "import type { ChainContentData } from './content-types.js';\n\nexport const contentData: ChainContentData = " +
    JSON.stringify(data, null, 2) +
    ";\n";
  await writeFile(new URL("../src/colour-chains/content.data.ts", import.meta.url), output);
  process.stdout.write(
    "Shizen " +
      data.shizen.count +
      " · " +
      data.shizen.checksum +
      "\nArashi " +
      data.arashi.count +
      " · " +
      data.arashi.checksum +
      "\n",
  );
}
