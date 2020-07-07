# SoftDOM SSR

DOM in Node that's pretty lightweight. Written so you can understand all of the
code in only a few minutes.

It's hardcoded for Stayknit right now but it should hopefully be clear how to
port it to your application. The history of `render.js` will show more simple
setups without a webserver+`fetch()`.

Note that `typeof window === undefined` as per SSR convention.
