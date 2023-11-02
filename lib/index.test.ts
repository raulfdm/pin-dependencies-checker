describe("lib", () => {
	describe("no pinned lib", () => {
		it("exits process with 0", () => {});

		it("prints a nice message", () => {});
	});

	describe("found pinned lib", () => {
		it("exits process with 1", () => {});

		describe("prod dependencies", () => {
			it("prints all pinned dependencies by default", () => {});
			it("does not print pinned dependencies if --deps=false", () => {});
		});

		describe("dev dependencies", () => {
			it("prints all pinned dependencies by default", () => {});
			it("does not print pinned dependencies if --devDeps=false", () => {});
		});

		describe("dev dependencies", () => {
			it("does not print pinned dependencies by default", () => {});
			it("prints pinned dependencies if --peerDeps=true", () => {});
		});

		describe("optional dependencies", () => {
			it("does not print pinned dependencies by default", () => {});
			it("prints pinned dependencies if --optionalDeps=true", () => {});
		});
	});
});
