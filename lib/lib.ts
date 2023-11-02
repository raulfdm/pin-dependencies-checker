import type { Package } from "./createPackage.js";
import { getPackagesFromDirectory } from "./getPackagesFromDirectory.js";
import { exitWithError, exitWithSuccess } from "./utils.js";

export async function lib() {
	const allPackages = await getPackagesFromDirectory();

	const allUnpinned = allPackages.filter((pkg) => pkg.hasUnpinnedDependency());

	if (allUnpinned.length > 0) {
		printUnpinnedDependencies(allUnpinned);
		exitWithError();
	} else {
		console.log("It seems all your dependencies are pinned :)");
		exitWithSuccess();
	}
}

function printUnpinnedDependencies(pkgs: Package[]) {
	for (const packagesWithUnpinned of pkgs) {
		console.group(`Package: ${packagesWithUnpinned.path}`);

		const unpinnedDeps = packagesWithUnpinned.getUnpinnedDependencies();

		for (const prodDeps of unpinnedDeps) {
			console.log(`→ ${prodDeps.name}@${prodDeps.version}`);
		}
		console.groupEnd();
	}
}
