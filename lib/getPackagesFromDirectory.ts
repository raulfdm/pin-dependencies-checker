import { getPackages } from "@manypkg/get-packages";
import { createPackage } from "./createPackage";

export async function getPackagesFromDirectory() {
	const { packages, rootPackage, tool } = await getPackages(process.cwd());

	const allPackages = packages.map(createPackage);

	/**
	 * In monorepos, rootPackage is not included in the `packages` list,
	 * so we have to include it manually.
	 */
	if (tool.isMonorepoRootSync(process.cwd()) && rootPackage) {
		allPackages.unshift(createPackage(rootPackage));
	}

	return allPackages;
}
