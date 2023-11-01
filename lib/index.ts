import { type Package, getPackages } from "@manypkg/get-packages";

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

	const allDependencies = {
		...(pkg.packageJson.devDependencies || {}),
		...(pkg.packageJson.dependencies || {}),
	};

	for (const [dependency, version] of Object.entries(allDependencies)) {
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
