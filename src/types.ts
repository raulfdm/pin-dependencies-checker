export type HashType = {
  [prop: string]: string;
};

type PackageJsonDependencies<T> = {
  dependencies: T;
  devDependencies: T;
  peerDependencies: T;
  optionalDependencies: T
};

export type AppConfig = PackageJsonDependencies<boolean>;
export type PackageJsonDeps = PackageJsonDependencies<HashType | undefined>;
