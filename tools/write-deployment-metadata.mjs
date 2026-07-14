import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

function currentCommit() {
  const environmentCommit = process.env['COMMIT_REF'] ?? process.env['GITHUB_SHA'];

  if (environmentCommit) {
    return environmentCommit;
  }

  try {
    const status = execFileSync('git', ['status', '--porcelain'], {
      encoding: 'utf8',
    });

    if (status.trim()) {
      return 'local';
    }

    return execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
    }).trim();
  } catch {
    return 'local';
  }
}

const outputPath = resolve(import.meta.dirname, '../dist/apps/web/deployment.json');

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ commit: currentCommit() })}\n`, 'utf8');
