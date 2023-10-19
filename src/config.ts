import args from 'node-args';

import { hasValueOr } from './helpers';

export const packageJsonPath = `${process.cwd()}/package.json`;

export const appConfig = {
  peerDependencies: hasValueOr(args.peerDeps, false) as boolean,
  dependencies: hasValueOr(args.deps, true) as boolean,
  devDependencies: hasValueOr(args.devDeps, true) as boolean,
  optionalDependencies: hasValueOr(args.optionalDeps, false) as boolean,
};
