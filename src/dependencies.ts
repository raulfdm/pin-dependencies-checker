import { packageJsonPath } from './config';
import { PackageJsonDeps } from './types';

export function getDependenciesFromPackageJson(): PackageJsonDeps {
  const {
    dependencies,
    peerDependencies,
    devDependencies,
  } = require(packageJsonPath);

  return { dependencies, peerDependencies, devDependencies };
}
