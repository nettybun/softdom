# SoftDOM SSR

DOM in Node that's pretty lightweight. Written so you can understand all of the
code in only a few minutes.

Hopefully it's clear how to port it to your application.

Notes:
  - `typeof window === undefined` as per SSR convention.
  - DocumentFragment doesn't handle moving children properly on insertBefore
  - Setting attributes via el[name] = value doesn't work unless defined
  - No support for data-* attribute / el.dataset
  - Element#contains() isn't real, along with many other complex methods...
