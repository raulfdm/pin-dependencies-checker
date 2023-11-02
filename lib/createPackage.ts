import type { Package as GetPackage } from "@manypkg/get-packages";
import { cliConfig } from "./commands";

export type Package = ReturnType<typeof createPackage>;

export function createPackage(pkg: GetPackage) {
	type Dependency = {
		name: string;
		version: string;
	};

	const unpinnedList: Dependency[] = [];

	const allDependencies = new Map<string, string>();

	if (cliConfig.deps && pkg.packageJson.dependencies) {
		for (const [dep, version] of Object.entries(pkg.packageJson.dependencies)) {
			allDependencies.set(dep, version);
		}
	}

	if (cliConfig.devDeps && pkg.packageJson.devDependencies) {
		for (const [dep, version] of Object.entries(
			pkg.packageJson.devDependencies,
		)) {
			allDependencies.set(dep, version);
		}
	}

	if (cliConfig.peerDeps && pkg.packageJson.peerDependencies) {
		for (const [dep, version] of Object.entries(
			pkg.packageJson.peerDependencies,
		)) {
			allDependencies.set(dep, version);
		}
	}

	if (cliConfig.optionalDeps && pkg.packageJson.optionalDependencies) {
		for (const [dep, version] of Object.entries(
			pkg.packageJson.optionalDependencies,
		)) {
			allDependencies.set(dep, version);
		}
	}

	for (const [dependency, version] of allDependencies.entries()) {
		if (version.includes("^")) {
			unpinnedList.push({
				name: dependency,
				version,
			});
		}
	}

	return {
		path: `${pkg.dir}/package.json`,
		getUnpinnedDependencies,
		hasUnpinnedDependency,
	};

	function getUnpinnedDependencies(): Dependency[] {
		return [...unpinnedList];
	}

	function hasUnpinnedDependency(): boolean {
		return unpinnedList.length > 0;
	}
}
