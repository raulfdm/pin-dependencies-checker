import { type Package, getPackages } from "@manypkg/get-packages";
import "./commands";
import { cliConfig } from "./commands";

const { packages, rootPackage } = await getPackages(process.cwd());

const allPackages = packages.map(createPackage);

/**
 * In monorepos, rootPackage is not included in the `packages` list,
 * so we have to include it manually.
 */
if (rootPackage) {
	allPackages.unshift(createPackage(rootPackage));
}

const allUnpinned = allPackages.filter((pkg) => pkg.hasUnpinnedDependency());

if (allUnpinned.length > 0) {
	printUnpinnedDependencies();
	process.exit(1);
} else {
	console.log("It seems all your dependencies are pinned :)");
	process.exit(0);
}

function printUnpinnedDependencies() {
	for (const packagesWithUnpinned of allUnpinned) {
		console.group(`Package: ${packagesWithUnpinned.path}`);

		const unpinnedDeps = packagesWithUnpinned.getUnpinnedDependencies();

		for (const prodDeps of unpinnedDeps) {
			console.log(`→ ${prodDeps.name}@${prodDeps.version}`);
		}
		console.groupEnd();
	}
}

function createPackage(pkg: Package) {
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
