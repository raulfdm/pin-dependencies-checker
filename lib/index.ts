import { getPackagesFromDirectory } from "./getPackagesFromDirectory.js";
import { exitWithError, exitWithSuccess } from "./utils.js";

const allPackages = await getPackagesFromDirectory();

const allUnpinned = allPackages.filter((pkg) => pkg.hasUnpinnedDependency());

console.log("ALL PACKAGES", allPackages);
if (allUnpinned.length > 0) {
	printUnpinnedDependencies();
	exitWithError();
} else {
	console.log("It seems all your dependencies are pinned :)");
	exitWithSuccess();
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
