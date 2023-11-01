import { type Package, getPackages } from "@manypkg/get-packages";

const { tool, packages, rootPackage, rootDir } = await getPackages(
	process.cwd(),
);

const allPackages = packages.map(createPackage);

const allUnpinned = allPackages
	.filter((pkg) => pkg.hasUnpinnedDependency())
	.map((pkg) => pkg.getUnpinnedDependencies());

if (allUnpinned.length > 0) {
	// warn the user
} else {
	console.log("It seems all your dependencies are pinned :)");
	process.exit(0);
}

function createPackage(pkg: Package) {
	type Dependency = {
		name: string;
		version: string;
	};

	const unpinnedList: {
		dev: Dependency[];
		prod: Dependency[];
	} = {
		dev: [],
		prod: [],
	};

	if (pkg.packageJson.devDependencies) {
		for (const [dependency, version] of Object.entries(
			pkg.packageJson.devDependencies,
		)) {
			if (version.includes("^")) {
				unpinnedList.dev.push({
					name: dependency,
					version,
				});
			}
		}
	}

	if (pkg.packageJson.dependencies) {
		for (const [dependency, version] of Object.entries(
			pkg.packageJson.dependencies,
		)) {
			if (version.includes("^")) {
				unpinnedList.prod.push({
					name: dependency,
					version,
				});
			}
		}
	}

	return {
		name: pkg.packageJson.name,
		getUnpinnedDependencies,
		hasUnpinnedDependency,
	};

	function getUnpinnedDependencies(): typeof unpinnedList | null {
		return structuredClone(unpinnedList);
	}

	function hasUnpinnedDependency(): boolean {
		return unpinnedList.dev.length > 0 || unpinnedList.prod.length > 0;
	}
}
