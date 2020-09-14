# SoftDOM SSR

DOM in Node that's pretty lightweight. Written so you can understand all of the
code in only a few minutes.

Hopefully it's clear how to port it to your application.

  - `typeof window === "undefined"` as per SSR convention.
  - If not already defined, setting `el[name] = value` throws due to
    `Object.seal()` **_This is a feature_** to save you from bugs.
  - Complex parts (i.e data-* attributes, el.contains(), el.innerText, etc) are
    left to implement if you need them - read below
  - Any browser magic like `<button>` defaulting to `type="submit"` isn't
    implemented, so be careful. [Read Domino for ideas/implementations][1]

## Examples

I've included two small examples that use the frontend directory "public/" which
does some vanilla HTML JS work. Use `npm run build` to run them.

```
$ npm run build
> softdom-example-webserver@0.0.0 build /home/today/_/work/softdom/example-webserver
> node --unhandled-rejections=strict --experimental-loader ../web-root-loader.mjs index.js

Koa server listening on 3000
Render: 9.250ms
Fetch 'http://localhost:3000/data.txt': 32ms
Koa server stopped
Serialize: 6.544ms
Written to: /home/today/_/work/softdom/public/indexSSR.html
```

For an example of a full web application written in Sinuous/JSX/TS that uses SSR
see https://gitlab.com/nthm/stayknit, specifically [its ssr/ folder][2].

## Implementation notes with `Object.seal()`

SoftDOM uses `Object.seal()` to throw errors when your web app tries to write
properties that don't exist, i.e `el.innerText = 'Text!'` will throw (read
below for workaround). This saves you from silent bugs!

Lets consider supporting an unimplemented method: innerText. [MDN][3] says it's
"almost" the same as Node#textContent (which is implemented in SoftDOM) but is
aware of how the text is rendered by the browser. Now imagine trying to
implement innerText to pass [their example][4]. That would be very difficult.

You know your tradeoffs best. Aliasing `innerText = this.textContent` might be
all you need. The W3C spec would explain how to write something more complex.

Don't be scared to hack at the code ✨✨

## API

At the end of SoftDOM's code you'll see:

```js
export { Node, Text, Element, DocumentFragment, Document, Event };
export { classProperties, elementAttributes, preventInstanceObjectSeal }
```

The first line is DOM objects, as expected.

The second line is to tweak SoftDOM's use of `Object.seal()` to workaround
errors. When you first run your app it'll likely crash when your framework/code
writes to a property or attribute that isn't defined. For example, "href" isn't
defined on `Element`, so it would throw on `<a href=...>` if not for
`elementAttributes` having `a: ["href"]` written. The provided object is very
minimal; you should add to it.

Similarly to get the Sinuous framework to work I needed to add to the `Element`
class by extending `classProperties` ([sourcecode][2]):

```js
// Need to patch `Element` for Sinuous
Object.assign(classProperties.Element, {
  // Naturally el._listeners = {} but minified. Ugh.
  t: {},
  // Otherwise throws: Cannot set property of 'cssText' of undefined
  style: {},
  // This isn't implemented in SoftDOM but I write to it in sinuous-trace/log
  dataset: {},
  // This isn't implemented in SoftDOM but I write to it in sinuous-trace/log
  contains() { return true; },
});
```

[1]: https://github.com/fgnass/domino/blob/master/lib/htmlelts.js#L342
[2]: https://gitlab.com/nthm/stayknit/tree/work/ssr
[3]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
[4]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText#Result
