import type { Package } from "./createPackage";
import { getPackagesFromDirectory } from "./getPackagesFromDirectory";
import { exitWithError, exitWithSuccess, log } from "./utils";

export async function lib() {
	const allPackages = await getPackagesFromDirectory();

	const allUnpinned = allPackages.filter((pkg) => pkg.hasUnpinnedDependency());

	if (allUnpinned.length > 0) {
		printUnpinnedDependencies(allUnpinned);
		exitWithError();
	} else {
		log("It seems all your dependencies are pinned :)");
		exitWithSuccess();
	}
}

function printUnpinnedDependencies(pkgs: Package[]) {
	for (const packagesWithUnpinned of pkgs) {
		log(`Package: ${packagesWithUnpinned.path}`);

		const unpinnedDeps = packagesWithUnpinned.getUnpinnedDependencies();

		for (const prodDeps of unpinnedDeps) {
			log(`→ ${prodDeps.name}@${prodDeps.version}`);
		}
	}
}
