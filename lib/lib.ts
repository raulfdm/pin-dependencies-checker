import consola from "consola";
import type { Package } from "./createPackage";
import { getPackagesFromDirectory } from "./getPackagesFromDirectory";
import { exitWithError, exitWithSuccess } from "./utils";

export async function lib() {
	const allPackages = await getPackagesFromDirectory();

	const allUnpinned = allPackages.filter((pkg) => pkg.hasUnpinnedDependency());

	if (allUnpinned.length > 0) {
		consola.error(
			"👮 It seems you have unpinned dependencies. Please remove the caret from then.",
		);
		printUnpinnedDependencies(allUnpinned);
		exitWithError();
	} else {
		consola.success("All dependencies are pinned! 🙌");
		exitWithSuccess();
	}
}

function printUnpinnedDependencies(pkgs: Package[]) {
	for (const packagesWithUnpinned of pkgs) {
		const messages = ["-------- File --------", packagesWithUnpinned.path];

		const unpinnedDeps = packagesWithUnpinned.getUnpinnedDependencies();

		messages.push("", "-------- Dependencies --------");
		for (const prodDeps of unpinnedDeps) {
			messages.push(`"${prodDeps.name}": "${prodDeps.version}"`);
		}

		consola.box(messages.join("\n"));
	}
}
