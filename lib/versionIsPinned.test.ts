import { versionIsPinned } from "./versionIsPinned";

describe("versionIsPinned", () => {
	test.each([
		["2.0.1", true],
		["2.0.0-alpha+001", true],
		["1.2.3", true],
		["1.23.4-alpha.123", true],
		["^1.2", false],
		["1.0.0 - 2.9999.9999", false],
		[">=1.0.2 <2.1.2", false],
		[">1.0.2 <=2.3.4", false],
		["<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0", false],
		["~1.2", false],
		["~1.2.3", false],
		["2.x", false],
		["1.2", false],
		["3.3.x", false],
		["latest", false],
		["a.b.c", false],
		["42.6.7.9.3-alpha", false],
		["http://asdf.com/asdf.tar.gz", true],
		["file:../dyl", true],
		["git+ssh://git@github.com:npm/cli.git#v1.0.27", true],
		["git+ssh://git@github.com:npm/cli#semver:^5.0", true],
		["git+https://isaacs@github.com/npm/cli.git", true],
		["git://github.com/npm/cli.git#v1.0.27", true],
		["expressjs/express", true],
		["mochajs/mocha#4727d357ea", true],
		["user/repo#feature/branch", true],
		["file:../foo/bar", true],
	])('versionIsPinned("%s") is %s', (version, expected) => {
		expect(versionIsPinned(version)).toBe(expected);
	});
});
