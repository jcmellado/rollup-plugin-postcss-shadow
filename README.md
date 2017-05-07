[![Build Status](https://travis-ci.org/jcmellado/rollup-plugin-postcss-shadow.svg)](https://travis-ci.org/jcmellado/rollup-plugin-postcss-shadow)

# rollup-plugin-postcss-shadow
Inline CSS styles inside shadow DOM with [Rollup](https://github.com/rollup/rollup) and [PostCSS](https://github.com/postcss/postcss).

# Installation
```bash
npm install --save-dev rollup-plugin-postcss-shadow
```

# Usage

```js
import cssshadow from 'rollup-plugin-postcss-shadow';

export default {
  entry: 'src/index.js',
  plugins: [
    cssshadow()
  ]
}
```

# Example

styles.css

```css
:root {
  --badge: {      /* Custom properties set */
    width: 50px;
    height: 50px;
  };
  --color-gold:	#D4AF37;   /* Custom property */
  --color-silver: #C0C0C0;
  --color-bronze: #cd7f32;
}

.badge-gold {
  @apply --badge;                 /* Custom properties set reference */
  background: var(--color-gold);  /* Custom property reference */
}
.badge-silver {
  @apply --badge;
  background: var(--color-silver);
}
.badge-bronze {
  @apply --badge;
  background: var(--color-bronze);
}
```

component.js

```js
import style from './styles.css';  // CSS import

export default class MyComponent extends BaseComponent {

  render() {  // JSX expression renderer to shadow DOM
    return ([
      <style>{style}</style>,   // CSS reference
      <div>
        <div class='badge-gold'></div>
        <div class='badge-silver'></div>
        <div class='badge-bronze'></div>
      </div>,
    ]);
  }
```

Result ([cssnext](http://cssnext.io/) and [cssnano](http://cssnano.co/) are applied in order get custom properties and `@apply` working and compress):

```js
var style = ".badge-gold,.badge-silver,.badge-bronze{width:50px;height:50px}.badge-gold{background:#d4af37}.badge-silver{background:#C0C0C0}{background:#cd7f32}";

...

  createClass(MyComponent, [{
    key: 'render',
    value: function render() {
      return [Dom.create( // JSX expression renderer to shadow DOM
        'style',
        null,
        style // CSS reference
      ), Dom.create(
        'div',
        null,
        Dom.create(Badge, { 'class': 'badge-gold' }),
        Dom.create(Badge, { 'class': 'badge-silver' }),
        Dom.create(Badge, { 'class': 'badge-bronze' })
      )];

```

Note that CSS is inlined and its classes can be referenced by its original name. This approach is a bit different from [css-modules](https://github.com/css-modules/css-modules) as far we are using shadow DOM and locally scoped styles are not really necessary.

# Options

```js
import cssnano from 'cssnano';
import cssnext from 'postcss-cssnext';
import cssshadow from 'rollup-plugin-postcss-shadow';

export default {
  entry: 'src/index.js',
  plugins: [
    cssshadow({

      // File extensions (default [.css])
      extensions: ['.css', '.scss']

      // PostCSS plugins (default [])
      plugins: [
        cssnext(),
        cssnano({
          autoprefixer: false,
        }),
      ],

      // PostCSS options (default undefined)
      // syntax: ...,
      // parser: ...,
      // stringifier: ..,
    }),
  ],
};
```

Heavily inspired by [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss).
