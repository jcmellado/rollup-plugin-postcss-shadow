/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Juan Mellado
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { createFilter } from 'rollup-pluginutils';
import { extname } from 'path';
import postcss from 'postcss';

export default function(options = {}) {
  options.extensions = options.extensions || ['.css'];

  // Rollup filter
  let filter = createFilter(options.include, options.exclude);

  // Checks supported file extensions and Rollup filter
  function _supports(id) {
    let extension = extname(id);

    return (options.extensions.indexOf(extension) !== -1) && filter(id);
  }

  // PostCSS options
  function _options(id) {
    return {
      syntax: options.syntax,
      parser: options.parser,
      stringifier: options.stringifier,
      map: {
        inline: false,
        annotation: false,
      },
      from: id,
      to: id,
    };
  }

  // Process the CSS with PostCSS
  function _process(code, id) {
    let processor = postcss(options.plugins || []);
    let opts = _options(id);

    return Promise.resolve()
      .then(() => processor.process(code, opts))
      .then((result) => {
        return {
          code: `export default ${JSON.stringify(result.css)}`,
          map: { mappings: '' },
        };
      });
  }

  // Plugin
  return {
    name: 'rollup-plugin-postcss-shadow',

    transform(code, id) {
      return _supports(id) ? _process(code, id) : null;
    },
  };
}
