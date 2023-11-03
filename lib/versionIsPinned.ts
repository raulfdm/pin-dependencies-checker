const semverPattern =
	/^(\d+)\.(\d+)\.(\d+)(-[\w-]+(\.[\w-]+)*)?(\+[\w-]+(\.[\w-]+)*)?$/;

function isUrl(version: string): boolean {
	// very basic test
	return version.includes("/");
}

export function versionIsPinned(version: string) {
	if (version === "" || version === "latest" || version === "*") {
		return false;
	}

	const firstCharacter = version[0] ?? "";

	if (["^", ">", "<", "~"].includes(firstCharacter)) {
		return false;
	}

	return semverPattern.test(version) || isUrl(version);
}
