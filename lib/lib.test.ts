import type { Packages as GetPackages } from "@manypkg/get-packages";
import type { CliConfigType } from "./getCliConfig";
import { lib } from "./lib";

const mockExitWithSuccess = vi.fn();
const mockExitWithError = vi.fn();
const mockLog = vi.fn();
vi.mock("./utils", () => ({
	exitWithSuccess: () => mockExitWithSuccess(),
	exitWithError: () => mockExitWithError(),
	// biome-ignore lint/suspicious/noExplicitAny: I don't care here
	log: (...args: any) => mockLog(...args),
}));

const mockGetPackages = vi.fn().mockResolvedValue({
	packages: [],
	rootPackage: null,
});
vi.mock("@manypkg/get-packages", () => ({
	getPackages: () => mockGetPackages(),
}));

const mockCommands = vi.fn();
vi.mock("./getCliConfig", () => ({
	get cliConfig() {
		return mockCommands();
	},
}));

describe("lib", () => {
	beforeEach(() => {
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
				  "It seems all your dependencies are pinned :)",
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
					  "Package: /path/to/dir/package.json",
					  "→ test-dep@^1.0.0",
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
					  "Package: /path/to/dir/package.json",
					  "→ test-dev-dep@^2.0.0",
					  "→ another-test-dev-dep@^1.0.0",
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
		it("includes the root package.json if found", async () => {
			doMockGetPackages({
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

			expect(mockLog.mock.calls.flat()).toMatchInlineSnapshot(`
				[
				  "Package: /path/to/root/package.json",
				  "→ root-dep@^1.0.0",
				  "Package: /path/to/dir/package.json",
				  "→ test-dep@^1.0.0",
				]
			`);
		});
	});
});

function doMockCommands(commands: Partial<CliConfigType> = {}) {
	const defaultConfig = {
		"peer-deps": false,
		"no-deps": false,
		"no-dev-deps": false,
		"optional-deps": false,
	} as CliConfigType;

	const config = {
		...defaultConfig,
		...commands,
	};

	mockCommands.mockReturnValue(config);
}

function doMockGetPackages(mockReturn: Partial<GetPackages> = {}) {
	const defaultReturn = {
		packages: [],
		rootPackage: undefined,
	} satisfies Partial<GetPackages>;

	mockGetPackages.mockReturnValue({
		...defaultReturn,
		...mockReturn,
	});
}
