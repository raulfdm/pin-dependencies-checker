export type HashType = {
	[prop: string]: string;
};

export type AppConfig = {
	dependencies: boolean;
	devDependencies: boolean;
	peerDependencies: boolean;
};

export type PackageJsonDeps = {
	dependencies: HashType | undefined;
	devDependencies: HashType | undefined;
	peerDependencies: HashType | undefined;
};
