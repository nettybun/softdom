# SoftDOM SSR

DOM in Node that's pretty lightweight. Written so you can understand all of the
code in only a few minutes.

Hopefully it's clear how to port it to your application.

  - `typeof window === undefined` as per SSR convention.
  - DocumentFragment doesn't handle moving children properly on insertBefore
  - If not already defined, setting `el[name] = value` doesn't work. **_This is
    a feature_** to save you from bugs.
  - Complex structues like data-* attributes, el.contains(), el.innerText, and
    others are left to you to implement (if you need to) - read below
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

## Implementation notes

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

[1]: https://github.com/fgnass/domino/blob/master/lib/htmlelts.js#L342
[2]: https://gitlab.com/nthm/stayknit/tree/work/ssr
[3]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
[4]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText#Result
