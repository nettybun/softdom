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

SoftDOM uses `Object.seal()` to throw errors when your web app tries to write
properties that don't exist, i.e `el.innerText = 'Text!'` will throw (read
below for workaround). This saves you from silent bugs!

Lets consider supporting an unimplemented method: innerText. [MDN][2] says it's
"almost" the same as Node#textContent (which is implemented in SoftDOM) but is
aware of how the text is rendered by the browser. Now imagine trying to
implement innerText to pass [their example][3]. That would be very difficult.

You know the tradeoffs that work best for your use case. The easiest would be
aliasing `innerText = this.textContent`. The hardest is reading and implementing
the W3C spec. You can write something in between that works for you. Don't be
scared to hack at the code ✨✨

[1]: https://github.com/fgnass/domino/blob/master/lib/htmlelts.js#L342
[2]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
[3]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText#Result
