const semverPattern =
	/^(\d+)\.(\d+)\.(\d+)(-[\w-]+(\.[\w-]+)*)?(\+[\w-]+(\.[\w-]+)*)?$/;

const containsCommitishPattern = /[a-f0-9]{5,40}/;

const containsSemverPattern =
	/(\d+)\.(\d+)\.(\d+)(-[\w-]+(\.[\w-]+)*)?(\+[\w-]+(\.[\w-]+)*)?/;

function isUrl(version: string): boolean {
	return version.includes("/");
}

interface VersionIsPinnedOptions {
	ignoreWorkspaces?: boolean;
	ignoreCatalog?: boolean;
}
export function versionIsPinned(
	version: string,
	options?: VersionIsPinnedOptions,
) {
	if (version === "" || version === "latest" || version === "*") {
		return false;
	}

	const firstCharacter = version[0] ?? "";

	if (["^", ">", "<", "~"].includes(firstCharacter)) {
		return false;
	}

	if (version.startsWith("file:")) {
		return true;
	}

	if (version.startsWith("workspace:")) {
		if (options?.ignoreWorkspaces) {
			return true;
		}
		return semverPattern.test(version.substring("workspace:".length));
	}

	if (version.startsWith("catalog:")) {
		if (options?.ignoreCatalog) {
			return true;
		}

		// Catalogs don't follow semver, so we don't need to check for it
		return false;
	}

	// Support package aliases: https://pnpm.io/aliases (Also works in npm and yarn)
	if (version.startsWith("npm:")) {
		const aliasedVersion = version.split("@").at(-1);
		if (!aliasedVersion) return false;
		return semverPattern.test(aliasedVersion);
	}

	if (isUrl(version)) {
		return (
			containsSemverPattern.test(version) ||
			containsCommitishPattern.test(version)
		);
	}

	return semverPattern.test(version) || isUrl(version);
}
