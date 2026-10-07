// Reproducible pictures of the shipped players, using the shared family renderer.
import { takePictures } from './readme-pictures-lib.mjs';

const gameShot = (subject, url, prepare) => ({ subject, url, target: '.game-screen', ready: '.game-screen .gem:not(.ghost)', prepare });
const campaign = (prefix, number) => async page => {
  await page.locator('#campaign').selectOption(prefix.slice(0, -1));
  const value = await page.locator('#level option').evaluateAll((options, { prefix, number }) => options.filter(option => option.value.startsWith(prefix))[number - 1].value, { prefix, number });
  await page.locator('#level').selectOption(value);
  await page.locator('#new').click();
};
await takePictures({ shots: [
  { subject: 'hero', views: ['desk', 'phone'], ready: '.game-screen .gem:not(.ghost)' },
  gameShot('falling-triplets', '/index.html'),
  gameShot('colour-chains', '/chains.html'),
  gameShot('stone-collapse', '/tools.html', async page => { await page.locator('#game').selectOption('stone-collapse'); await page.locator('#new').click(); }),
  gameShot('gem-swap', '/tools.html'),
  gameShot('magnetic-blocks', '/blocks.html', async page => { await page.locator('#level').selectOption({ index: 97 }); await page.locator('#new').click(); }),
  gameShot('shizen', '/chains.html', campaign('shizen-', 97)),
  gameShot('arashi', '/chains.html', campaign('arashi-', 97)),
  { subject: 'tool-tray', views: ['phone'], url: '/tools.html', target: '.game-screen', ready: '.game-screen .gem:not(.ghost)' },
] });
