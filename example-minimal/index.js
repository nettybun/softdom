import { promises as fs } from 'fs';
import path from 'path';

import {
  Node,
  Text,
  Element,
  Document,
  DocumentFragment,
  Event
} from 'softdom';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const rootPublicDir = '../public';
const asPublicPath = filepath => path.join(__dirname, rootPublicDir, filepath);

const window = {
  // Constructors
  Document,
  DocumentFragment,
  Node,
  Text,
  Element,
  SVGElement: Element,
  Event,
  // Many properties are hard to support, for instance, window.location isn't a
  // string, it's a "Location" object. Also "window" isn't defined so using
  // properties like "window.innerHeight" wouldn't be accessible
};

const document = new Document();
window.document = document;
document.defaultView = window;

// Allows statements like "if (el instanceof Node)" as Node is a global
for (const key in window) global[key] = window[key];

// XXX: Convention to detect SSR when "window" isn't set, so don't set it
// XXX: global.window = window;
global.document = document;

// Create the initial blank DOM
document.documentElement = document.createElement('html');
document.head = document.createElement('head');
document.body = document.createElement('body');

document.appendChild(document.documentElement);
document.documentElement.appendChild(document.head);
document.documentElement.appendChild(document.body);

(async () => {
  console.time('Render');
  // Your JS entrypoint here (the one you would have as a <script> tag in HTML)
  await import(asPublicPath('web.js'));
  console.timeEnd('Render');

  console.time('Serialize');
  const serialized = document.body.innerHTML;
  console.timeEnd('Serialize');

  const inPath = asPublicPath('index.html');
  const indexHTML = await fs.readFile(inPath, 'utf-8');
  const outPath = asPublicPath('indexSSR.html');
  await fs.writeFile(outPath, indexHTML.replace('<!--SSR-->', serialized));

  console.log('Written to:', outPath);
})();
