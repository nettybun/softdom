import { promises as fs } from 'fs';
import path from 'path';

// Import all your dependencies here, like fetch() or AbortController()
// If doing fetch() work, consider patching it to wait for all active requests

import { document } from './softdom.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

(async () => {
  console.time('Render');
  await import('../../serve/index.js');
  console.timeEnd('Render');

  const serialized = document.body.innerHTML;

  const inPath = path.resolve(__dirname, '../../serve/index.html');
  const indexHTML = await fs.readFile(inPath, 'utf-8');
  const outPath = path.resolve(__dirname, '../../serve/indexSSR.html');
  await fs.writeFile(outPath, indexHTML.replace('<!--SSR-->', serialized));

  console.log('Written to:', outPath);
})();
