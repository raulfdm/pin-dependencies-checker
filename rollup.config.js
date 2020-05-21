import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-auto-external';

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    banner: '#!/usr/bin/env node',
  },
  plugins: [typescript(), external({ dependencies: true })],
};
