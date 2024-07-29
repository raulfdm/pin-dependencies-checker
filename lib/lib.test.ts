import type { Packages as GetPackages } from "@manypkg/get-packages";
import consola from "consola";
import type { PartialDeep } from "type-fest";
import type { CliConfigType } from "./getCliConfig";
import { lib } from "./lib";

const mockGetPackages = vi.fn();
vi.mock("@manypkg/get-packages", () => ({
	getPackages: () => mockGetPackages(),
}));

const mockGetCliConfig = vi.fn();
vi.mock("./getCliConfig", () => ({
	getCliConfig: () => mockGetCliConfig(),
}));

const mockExitWithSuccess = vi.fn();
const mockExitWithError = vi.fn();
const mockLog = vi.fn();
vi.mock("./utils", () => ({
	exitWithSuccess: () => mockExitWithSuccess(),
	exitWithError: () => mockExitWithError(),
}));

describe("lib", () => {
	beforeAll(() => {
		consola.wrapAll();
	});

	beforeEach(() => {
		consola.mockTypes(() => mockLog);
		doMockCommands();
		doMockGetPackages();
	});

	describe("no pinned lib", () => {
		it("exits process with 0", async () => {
			await lib();
			expect(mockExitWithSuccess).toHaveBeenCalled();
		});

		it("prints a nice message", async () => {
			await lib();

			expect(mockLog.mock.calls.flat()).toMatchInlineSnapshot(`
				[
				  "All dependencies are pinned! 🙌",
				]
			`);
		});
	});

	describe("found pinned lib", () => {
		it("exits process with 1", async () => {
			doMockGetPackages({
				packages: [
					{
						dir: "/path/to/dir",
						relativeDir: "dir",
						packageJson: {
							name: "test",
							version: "1.0.0",
							dependencies: {
								"test-dep": "^1.0.0",
							},
						},
					},
				],
			});

			await lib();
			expect(mockExitWithError).toHaveBeenCalled();
		});

		describe("prod dependencies", () => {
			beforeEach(() => {
				doMockGetPackages({
					packages: [
						{
							dir: "/path/to/dir",
							relativeDir: "dir",
							packageJson: {
								name: "test",
								version: "1.0.0",
								dependencies: {
									"test-dep": "^1.0.0",
								},
							},
						},
					],
				});
			});

			it("prints all pinned dependencies by default", async () => {
				await lib();

				expect(mockLog.mock.calls.flat()).toMatchInlineSnapshot(`
					[
					  "👮 It seems you have unpinned dependencies. Please remove the caret from then.",
					  "-------- File --------
					/path/to/dir/package.json

					-------- Dependencies --------
					"test-dep": "^1.0.0"",
					]
				`);
			});

			it("does not fail if --deps=false but there are unpinned production dependencies", async () => {
				doMockCommands({
					"no-deps": true,
				});

				await lib();

				expect(mockExitWithSuccess).toHaveBeenCalled();
			});
		});

		describe("dev dependencies", () => {
			beforeEach(() => {
				doMockGetPackages({
					packages: [
						{
							dir: "/path/to/dir",
							relativeDir: "dir",
							packageJson: {
								name: "test",
								version: "1.0.0",
								devDependencies: {
									"test-dev-dep": "^2.0.0",
									"another-test-dev-dep": "^1.0.0",
								},
							},
						},
					],
				});
			});

			it("prints all pinned dependencies by default", async () => {
				await lib();

				expect(mockLog.mock.calls.flat()).toMatchInlineSnapshot(`
					[
					  "👮 It seems you have unpinned dependencies. Please remove the caret from then.",
					  "-------- File --------
					/path/to/dir/package.json

					-------- Dependencies --------
					"test-dev-dep": "^2.0.0"
					"another-test-dev-dep": "^1.0.0"",
					]
				`);
			});

			it("does not print pinned dependencies if --no-dev-deps", async () => {
				doMockCommands({
					"no-dev-deps": true,
				});

				await lib();

				expect(mockExitWithSuccess).toHaveBeenCalled();
			});
		});

		describe("peer dependencies", () => {
			beforeEach(() => {
				doMockGetPackages({
					packages: [
						{
							dir: "/path/to/dir",
							relativeDir: "dir",
							packageJson: {
								name: "test",
								version: "1.0.0",
								peerDependencies: {
									"react-dom": "^18.0.0",
								},
							},
						},
					],
				});
			});

			it("does not print pinned dependencies by default", async () => {
				await lib();

				expect(mockExitWithSuccess).toHaveBeenCalled();
			});

			it("prints pinned dependencies if --peer-deps is present", async () => {
				doMockCommands({
					"peer-deps": true,
				});

				await lib();

				expect(mockExitWithError).toHaveBeenCalled();
			});
		});

		describe("optional dependencies", () => {
			beforeEach(() => {
				doMockGetPackages({
					packages: [
						{
							dir: "/path/to/dir",
							relativeDir: "dir",
							packageJson: {
								name: "test",
								version: "1.0.0",
								optionalDependencies: {
									lodash: "^4.0.0",
								},
							},
						},
					],
				});
			});

			it("does not print pinned dependencies by default", async () => {
				await lib();

				expect(mockExitWithSuccess).toHaveBeenCalled();
			});

			it("prints pinned dependencies if --optionalDeps=true", async () => {
				doMockCommands({
					"optional-deps": true,
				});

				await lib();

				expect(mockExitWithError).toHaveBeenCalled();
			});
		});
	});

	describe("monorepo", () => {
		it("includes the root package.json if found and it's marked as monorepo", async () => {
			doMockGetPackages({
				tool: {
					isMonorepoRootSync: () => true,
				},
				rootPackage: {
					dir: "/path/to/root",
					relativeDir: "root",
					packageJson: {
						name: "root",
						version: "1.0.0",
						dependencies: {
							"root-dep": "^1.0.0",
						},
					},
				},
				packages: [
					{
						dir: "/path/to/dir",
						relativeDir: "dir",
						packageJson: {
							name: "test",
							version: "1.0.0",
							dependencies: {
								"test-dep": "^1.0.0",
							},
						},
					},
				],
			});

			await lib();

			expect(mockLog).toHaveBeenCalledWith(
				expect.stringContaining("/path/to/root/package.json"),
			);
			expect(mockLog).toHaveBeenCalledWith(
				expect.stringContaining(`"root-dep": "^1.0.0"`),
			);
			expect(mockLog).toHaveBeenCalledWith(
				expect.stringContaining(`"test-dep": "^1.0.0"`),
			);
		});
	});

	describe("catalog", () => {
		it("ignores catalog packages", async () => {
			doMockCommands({
				"ignore-catalog": true,
			});
			doMockGetPackages({
				packages: [
					{
						dir: "/path/to/dir",
						relativeDir: "dir",
						packageJson: {
							name: "test",
							version: "1.0.0",
							dependencies: {
								"test-dep": "^1.0.0",
							},
						},
					},
					{
						dir: "/path/to/pkg",
						relativeDir: "pkg",
						packageJson: {
							name: "pkg",
							version: "1.0.0",
							dependencies: {
								"dep-name": "catalog:",
							},
						},
					},
					{
						dir: "/path/to/pkg-2",
						relativeDir: "pkg-2",
						packageJson: {
							name: "pkg-2",
							version: "1.0.0",
							dependencies: {
								"dep-name": "catalog:react19",
							},
						},
					},
				],
			});

			await lib();

			expect(mockLog).not.toHaveBeenCalledWith(
				expect.stringContaining("/path/to/pkg/package.json"),
			);
			expect(mockLog).not.toHaveBeenCalledWith(
				expect.stringContaining("/path/to/pkg-2/package.json"),
			);
			expect(mockLog).toHaveBeenCalledWith(
				expect.stringContaining("/path/to/dir/package.json"),
			);
		});
	});
});

function doMockCommands(commands: Partial<CliConfigType> = {}) {
	const defaultConfig = {
		"ignore-workspaces": false,
		"ignore-catalog": false,
		"peer-deps": false,
		"no-deps": false,
		"no-dev-deps": false,
		"optional-deps": false,
	} as CliConfigType;

	const config = {
		...defaultConfig,
		...commands,
	};

	mockGetCliConfig.mockReturnValue(config);
}

function doMockGetPackages(mockReturn: PartialDeep<GetPackages> = {}) {
	const defaultReturn = {
		packages: [],
		rootPackage: undefined,
		...mockReturn,
		tool: {
			isMonorepoRootSync: () => false,
			...mockReturn?.tool,
		},
	} satisfies PartialDeep<GetPackages>;

	mockGetPackages.mockReturnValue(defaultReturn);
}
