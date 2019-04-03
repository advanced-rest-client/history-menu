[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/history-menu.svg)](https://www.npmjs.com/package/@advanced-rest-client/history-menu)

[![Build Status](https://travis-ci.org/advanced-rest-client/history-menu.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/history-menu)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/history-menu)


# &lt;history-menu&gt;

A list of history items in the ARC main menu.

## Example:

```html
<history-menu on-file-accepted="..."></history-menu>
```

## API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/history-menu
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import './node_modules/@advanced-rest-client/history-menu/history-menu.js';
    </script>
  </head>
  <body>
    <history-menu></history-menu>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from './node_modules/@polymer/polymer/polymer-element.js';
import './node_modules/@advanced-rest-client/history-menu/history-menu.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <history-menu></history-menu>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/history-menu
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
