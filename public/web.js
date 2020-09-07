const element = document.createElement('p');
const text = document.createTextNode('Hey 🌱');
element.appendChild(text);
document.body.appendChild(element);

// Throws as expected: ".contains is not a function"
// if (element.contains(text)) {}

// Throws as expected: "Cannot add property innerText, object is not extensible"
// element.innerText += '✨✨'

// You can add fields and implementations to your DOM as needed. It may depend
// on your framework. For instance, Sinuous works out of the box even for
// complex applications with observables and rerendering.

fetch('data.txt')
  .then(data => data.text())
  .then(text => {
    const element = document.createElement('p');
    element.appendChild(document.createTextNode(text.trim()));
    document.body.appendChild(element);
  });
