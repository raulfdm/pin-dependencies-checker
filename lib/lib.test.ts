import type { Package as GetPackage } from "@manypkg/get-packages";
import type { CliConfigType } from "./commands.js";
import { lib } from "./lib.js";

const mockExitWithSuccess = vi.fn();
const mockExitWithError = vi.fn();
vi.mock("./utils.js", () => ({
	exitWithSuccess: () => mockExitWithSuccess(),
	exitWithError: () => mockExitWithError(),
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
	});

	describe("no pinned lib", () => {
		it("exits process with 0", async () => {
			await lib();
			expect(mockExitWithSuccess).toHaveBeenCalled();
		});

		it.skip("prints a nice message", async () => {
			const consoleLogSpy = vi.spyOn(console, "log");

			await lib();

			expect(consoleLogSpy).toHaveBeenCalledWith(
				"It seems all your dependencies are pinned :)",
			);
		});
	});

	describe("found pinned lib", () => {
		it("exits process with 1", async () => {
			mockGetPackages.mockReturnValue({
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
			it("prints all pinned dependencies by default", async () => {
				const consoleLogSpy = vi.spyOn(console, "log");

				mockGetPackages.mockReturnValue({
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

				const [firstPrint] = consoleLogSpy.mock.calls[0] || [];
				expect(firstPrint).toMatchInlineSnapshot(
					'"Package: /path/to/dir/package.json"',
				);

				const [secondPrint] = consoleLogSpy.mock.calls[1] || [];
				expect(secondPrint).toMatchInlineSnapshot('"→ test-dep@^1.0.0"');
			});

			it("does not fail if --deps=false but there are unpinned production dependencies", async () => {
				doMockCommands({
					deps: false,
				});

				mockGetPackages.mockReturnValue({
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

				expect(mockExitWithSuccess).toHaveBeenCalled();
			});
		});

		describe("dev dependencies", () => {
			const mockPackage = {
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
			} as GetPackage;

			it("prints all pinned dependencies by default", async () => {
				const consoleLogSpy = vi.spyOn(console, "log");

				mockGetPackages.mockReturnValue({
					packages: [mockPackage],
				});

				await lib();

				const [firstPrint] = consoleLogSpy.mock.calls[0] || [];
				expect(firstPrint).toMatchInlineSnapshot(
					'"Package: /path/to/dir/package.json"',
				);

				const [secondPrint] = consoleLogSpy.mock.calls[1] || [];
				expect(secondPrint).toMatchInlineSnapshot('"→ test-dev-dep@^2.0.0"');

				const [thirdPrint] = consoleLogSpy.mock.calls[2] || [];
				expect(thirdPrint).toMatchInlineSnapshot(
					'"→ another-test-dev-dep@^1.0.0"',
				);
			});

			it("does not print pinned dependencies if --devDeps=false", async () => {
				doMockCommands({
					devDeps: false,
				});

				mockGetPackages.mockReturnValue({
					packages: [mockPackage],
				});

				await lib();

				expect(mockExitWithSuccess).toHaveBeenCalled();
			});
		});

		describe("peer dependencies", () => {
			it.todo("does not print pinned dependencies by default", async () => {});
			it.todo("prints pinned dependencies if --peerDeps=true", async () => {});
		});

		describe("optional dependencies", () => {
			it.todo("does not print pinned dependencies by default", async () => {});
			it.todo(
				"prints pinned dependencies if --optionalDeps=true",
				async () => {},
			);
		});
	});
});

function doMockCommands(commands: Partial<CliConfigType> = {}) {
	const defaultConfig = {
		peerDeps: false,
		deps: true,
		devDeps: true,
		optionalDeps: false,
	};

	const config = {
		...defaultConfig,
		...commands,
	};

	mockCommands.mockReturnValue(config);
}
