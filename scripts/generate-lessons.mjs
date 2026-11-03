import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const drafts = JSON.parse(await readFile(path.join(root, 'content/lesson-drafts.json'), 'utf8'));
for (const [levelId, lessons] of Object.entries(drafts)) {
  const folder = path.join(root, 'content/levels', levelId, 'lessons');
  await mkdir(folder, { recursive: true });
  for (const draft of lessons) {
    const literal = JSON.stringify(draft, null, 2);
    const source = `import { buildLesson } from '../../../../src/lib/lesson-builder';\n\nexport const draft = ${literal};\nexport const lesson = buildLesson(draft);\n\n## Why it matters for an FDE\n\n${draft.why}\n\n## The idea\n\n${draft.concept}\n\n> ${draft.analogy}\n\n## Worked example\n\n${draft.example}\n\n## Common mistakes\n\n- ${draft.mistake}\n- ${draft.nextStep}\n\n## Quick check\n\nAnswer the three questions below. Read the explanation before moving on.\n`;
    await writeFile(path.join(folder, `${draft.id}.mdx`), source, 'utf8');
  }
}
console.log(`Generated ${Object.values(drafts).flat().length} MDX lessons.`);
