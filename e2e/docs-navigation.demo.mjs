import { expect,test } from '@playwright/test';
import { start,ORIGIN } from './demo.mjs';
for(const file of ['index.html','chains.html','tools.html','blocks.html']){
 test(`Docs follows initial and live language on ${file}`,async({page})=>{
  const errors=await start(page);
  await page.goto(`${ORIGIN}/${file}?lang=ja`);
  const docs=page.locator('[data-say="pageDocs"]');
  await expect(docs).toHaveText('ドキュメント');
  await expect(docs).toHaveAttribute('href','docs/ja/index.html');
  await page.locator('button[data-lang="en"]').click();
  await expect(docs).toHaveAttribute('href','docs/index.html');
  await page.locator('button[data-lang="ja"]').click();
  await docs.click();
  await expect(page).toHaveURL(`${ORIGIN}/docs/ja/index.html`);
  await expect(page.locator('html')).toHaveAttribute('lang','ja');
  expect(errors).toEqual([]);
 });
}
test('API anchor leads to a native reference, Japanese and back to the player',async({page})=>{
 const errors=await start(page);
 await page.goto(`${ORIGIN}/api.html`);
 await expect(page.locator('h1')).toHaveText('Houseki API: every export');
 expect(await page.locator('article[id]').count()).toBeGreaterThan(100);
 await page.locator('#falling-triplets-createGame h3 a').click();
 await expect(page.locator('h1')).toContainText('createGame');
 await expect(page.locator('main pre').first()).toContainText('@johnmorrisdotca/houseki/falling-triplets');
 await page.locator('header .lang a[data-lang="ja"]').click();
 await expect(page.locator('html')).toHaveAttribute('lang','ja');
 await page.getByRole('link',{name:'デモ',exact:true}).click();
 await expect(page.locator('#well')).toBeVisible();
 expect(errors).toEqual([]);
});
