import type { Packages as GetPackages } from "@manypkg/get-packages";
import type { CliConfigType } from "./commands.js";
import { lib } from "./lib.js";

const mockExitWithSuccess = vi.fn();
const mockExitWithError = vi.fn();
const mockLog = vi.fn();
vi.mock("./utils.js", () => ({
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
vi.mock("./commands.js", () => ({
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

			expect(mockLog).toHaveBeenCalledWith(
				"It seems all your dependencies are pinned :)",
			);
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

				const [firstPrint] = mockLog.mock.calls[0] || [];
				expect(firstPrint).toMatchInlineSnapshot(
					'"Package: /path/to/dir/package.json"',
				);

				const [secondPrint] = mockLog.mock.calls[1] || [];
				expect(secondPrint).toMatchInlineSnapshot('"→ test-dep@^1.0.0"');
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

				const [firstPrint] = mockLog.mock.calls[0] || [];
				expect(firstPrint).toMatchInlineSnapshot(
					'"Package: /path/to/dir/package.json"',
				);

				const [secondPrint] = mockLog.mock.calls[1] || [];
				expect(secondPrint).toMatchInlineSnapshot('"→ test-dev-dep@^2.0.0"');

				const [thirdPrint] = mockLog.mock.calls[2] || [];
				expect(thirdPrint).toMatchInlineSnapshot(
					'"→ another-test-dev-dep@^1.0.0"',
				);
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
