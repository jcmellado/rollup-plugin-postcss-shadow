import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';

export default {
  moduleName: 'rollup-plugin-postcss-shadow',
  entry: 'src/index.js',
  targets: [
    { dest: 'dist/rollup-plugin-postcss-shadow.cjs.js', format: 'cjs' },
    { dest: 'dist/rollup-plugin-postcss-shadow.es.js', format: 'es' },
  ],
  plugins: [
    eslint(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  external: [
    'path',
    'postcss',
    'rollup-pluginutils',
  ],
};
