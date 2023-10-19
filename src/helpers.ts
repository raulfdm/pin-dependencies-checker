import { HashType, PackageJsonDeps, AppConfig } from './types';

export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

export function isUndefined(val: unknown): boolean {
  return typeof val === 'undefined';
}

export function hasValueOr<T, V>(variable: T, defaultValue: V): T | V {
  return isUndefined(variable) ? defaultValue : variable;
}

export function getDependencies(
  { dependencies, devDependencies, peerDependencies, optionalDependencies }: PackageJsonDeps,
  appConfig: AppConfig,
): HashType {
  let result = {} as Partial<HashType>;

  if (appConfig.dependencies) {
    result = { ...result, ...dependencies };
  }

  if (appConfig.devDependencies) {
    result = { ...result, ...devDependencies };
  }

  if (appConfig.peerDependencies) {
    result = { ...result, ...peerDependencies };
  }

  if (appConfig.optionalDependencies) {
    result = { ...result, ...optionalDependencies };
  }

  return result as HashType;
}

export function filterUnpinnedDependencies(dependencies: HashType): HashType {
  const pairs = Object.entries(dependencies);

  return pairs.reduce((acc, [name, version]): HashType => {
    if (version.includes('^')) {
      acc[name] = version;
    }

    return acc;
  }, {} as HashType);
}
