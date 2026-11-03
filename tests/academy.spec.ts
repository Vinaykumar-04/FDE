import { expect, test } from '@playwright/test';

async function seedLevelZeroGate(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    if (localStorage.getItem('fde-hero-progress')) return;
    const state = {
      version: 1, xp: 0,
      completedLessons: ['what-an-fde-does', 'fde-career-paths', 'terminal-basics', 'git-and-python', 'http-and-status-codes', 'json-and-integrations'],
      quizBest: { 'gate:L0-recruit': 5 }, gameBest: {}, bossPassed: [], badges: [],
      streak: { current: 0, lastDay: '' }, cards: {},
    };
    localStorage.setItem('fde-hero-progress', JSON.stringify({ state, version: 1 }));
  });
}

test('finishing a lesson earns XP', async ({ page }) => {
  await page.goto('/lesson/what-an-fde-does/');
  for (const answer of ['A customer problem solved in the real environment', 'Throughout discovery, building, and handover', 'Putting software into the environment where it will be used']) {
    await page.getByRole('button', { name: new RegExp(answer) }).click();
    if (answer !== 'Putting software into the environment where it will be used') await page.getByRole('button', { name: /Next question/ }).click();
  }
  await page.getByRole('button', { name: /Finish lesson/ }).click();
  await expect(page.getByText('Lesson complete')).toBeVisible();
  await expect(page.locator('.xp-pill')).toContainText('60 XP');
});

test('a failed boss keeps the next level locked', async ({ page }) => {
  await seedLevelZeroGate(page);
  await page.goto('/boss/integration-script/');
  await page.getByRole('button', { name: /Rewrite the integration immediately/ }).click();
  await expect(page.getByText('Review the clue.')).toBeVisible();
  await page.goto('/map/');
  await expect(page.locator('.road-node').nth(1)).toContainText('LOCKED');
});

test('passing the boss unlocks the next level', async ({ page }) => {
  await seedLevelZeroGate(page);
  await page.goto('/boss/integration-script/');
  const correctAnswers = [/Ask for one affected example/, /Map the fields and test one safe sample/, /Explain the change, limits, and how to monitor it/];
  for (let i = 0; i < correctAnswers.length; i += 1) {
    await page.getByRole('button', { name: correctAnswers[i] }).click();
    if (i < correctAnswers.length - 1) await page.getByRole('button', { name: /Continue/ }).click();
  }
  await expect(page.getByText('MISSION COMPLETE')).toBeVisible();
  await page.goto('/map/');
  await expect(page.locator('.road-node').nth(1)).toContainText('UNLOCKED');
});

test('level pages show their six lessons, lab, quiz gate, and boss challenge', async ({ page }) => {
  await page.goto('/level/L5-fde-hero/');
  await expect(page.locator('.lesson-row')).toHaveCount(6);
  await expect(page.locator('#quiz-gate').getByRole('heading', { name: /Check your/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Your field/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Customer Room/ })).toHaveAttribute('href', '/play/customer-room/');
});

test('fresh progress keeps the level quiz and boss challenge locked', async ({ page }) => {
  await page.goto('/level/L0-recruit/');
  await expect(page.getByText(/Complete all 6 lessons to open this quiz/)).toBeVisible();
  await page.goto('/boss/integration-script/');
  await expect(page.getByText(/Pass your level quiz first/)).toBeVisible();
});

test('account page keeps guest learning available before cloud setup', async ({ page }) => {
  await page.goto('/account/');
  await expect(page.getByRole('heading', { name: /Progress that travels/ })).toBeVisible();
  await expect(page.getByText(/Cloud accounts are not configured yet/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Back to your profile/ })).toHaveAttribute('href', '/profile/');
});

test('home page fits a 360px phone viewport without horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth }));
  expect(widths.page).toBeLessThanOrEqual(widths.viewport);
});

test('progress export can be imported after clearing local progress', async ({ page }) => {
  await page.goto('/lesson/what-an-fde-does/');
  for (const answer of ['A customer problem solved in the real environment', 'Throughout discovery, building, and handover', 'Putting software into the environment where it will be used']) {
    await page.getByRole('button', { name: new RegExp(answer) }).click();
    if (answer !== 'Putting software into the environment where it will be used') await page.getByRole('button', { name: /Next question/ }).click();
  }
  await page.getByRole('button', { name: /Finish lesson/ }).click();
  await page.goto('/profile/');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export progress/ }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  expect(downloadPath).toBeTruthy();
  await page.evaluate(() => localStorage.removeItem('fde-hero-progress'));
  await page.reload();
  if (!downloadPath) throw new Error('Progress export did not produce a file.');
  await page.locator('input[type=file]').setInputFiles(downloadPath);
  await expect(page.getByRole('status')).toContainText('Progress restored');
  await expect(page.locator('.profile-xp')).toContainText('60');
  await expect(page.locator('.profile-stats')).toContainText('1');
});

test('a lesson route opens offline after the service worker has cached lessons', async ({ page, context }) => {
  await page.goto('/lesson/what-an-fde-does/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await context.setOffline(true);
  await page.goto('/lesson/fde-career-paths/');
  await expect(page.getByRole('heading', { name: /FDE and nearby career paths/ })).toBeVisible();
});
