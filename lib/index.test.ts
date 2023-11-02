import { createPackage } from "./createPackage.js";

const mockExitWithSuccess = vi.fn();
const mockExitWithError = vi.fn();
vi.mock("./utils.ts", () => ({
	exitWithSuccess: () => mockExitWithSuccess(),
	exitWithError: () => mockExitWithError(),
}));

const mockGetPackagesFromDirectory = vi.fn();
vi.mock("./getPackagesFromDirectory", () => ({
	getPackagesFromDirectory: mockGetPackagesFromDirectory,
}));

describe("lib", () => {
	describe("no pinned lib", () => {
		it("exits process with 0", async () => {
			mockGetPackagesFromDirectory.mockResolvedValueOnce([]);
			await import("./index");
			expect(mockExitWithSuccess).toHaveBeenCalled();
		});

		it.skip("prints a nice message", async () => {
			const consoleLogSpy = vi.spyOn(console, "log");

			await import("./index");
			expect(consoleLogSpy).toHaveBeenCalledWith(
				"It seems all your dependencies are pinned :)",
			);
		});
	});

	describe("found pinned lib", () => {
		it.only("exits process with 1", async () => {
			mockGetPackagesFromDirectory.mockReturnValue([
				createPackage({
					dir: "/path/to/dir",
					relativeDir: "dir",
					packageJson: {
						name: "test",
						version: "1.0.0",
						dependencies: {
							"test-dep": "^1.0.0",
						},
					},
				}),
			]);

			await import("./index");
			expect(mockExitWithError).toHaveBeenCalled();
		});

		describe("prod dependencies", () => {
			it.todo("prints all pinned dependencies by default", () => {});
			it.todo("does not print pinned dependencies if --deps=false", () => {});
		});

		describe("dev dependencies", () => {
			it.todo("prints all pinned dependencies by default", () => {});
			it.todo(
				"does not print pinned dependencies if --devDeps=false",
				() => {},
			);
		});

		describe("dev dependencies", () => {
			it.todo("does not print pinned dependencies by default", () => {});
			it.todo("prints pinned dependencies if --peerDeps=true", () => {});
		});

		describe("optional dependencies", () => {
			it.todo("does not print pinned dependencies by default", () => {});
			it.todo("prints pinned dependencies if --optionalDeps=true", () => {});
		});
	});
});
