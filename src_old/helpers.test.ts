import {
	filterUnpinnedDependencies,
	getDependencies,
	hasValueOr,
	isEmpty,
	isUndefined,
} from "./helpers";

vi.mock("../config", () => ({ appConfig: vi.fn() }));

describe("fn: isEmpty", () => {
	it("returns true when an object is empty", () => {
		expect(isEmpty({})).toBe(true);
	});

	it("returns false when an object is not empty", () => {
		expect(isEmpty({ foo: "bar" })).toBe(false);
	});
});

describe("fn: isUndefined", () => {
	it("returns true if receive undefined value", () => {
		expect(isUndefined(undefined)).toBe(true);
	});

	it("returns false if receive anything different from undefined", () => {
		expect(isUndefined(false)).toBe(false);
		expect(isUndefined(true)).toBe(false);
		expect(isUndefined(13)).toBe(false);
		expect(isUndefined("non")).toBe(false);
		expect(isUndefined({})).toBe(false);
		expect(isUndefined(() => {})).toBe(false);
		expect(isUndefined([])).toBe(false);
	});
});

describe("fn: hasValueOr", () => {
	it("returns default value if variable sent is undefined", () => {
		expect(hasValueOr(undefined, false)).toBe(false);
		expect(hasValueOr(undefined, true)).toBe(true);
		expect(hasValueOr(undefined, 123)).toBe(123);
	});

	it("returns variable if it is not undefined", () => {
		expect(hasValueOr(false, true)).toBe(false);
		expect(hasValueOr(true, 33)).toBe(true);
		expect(hasValueOr({}, false)).toEqual({});
	});
});

const dependencies = {
	foobar: "^3.0.0",
};
const devDependencies = {
	foo: "1.3",
	bar: "^1.4",
};
const peerDependencies = {
	barzz: "4.1.2",
};

const userDependencies = {
	dependencies,
	devDependencies,
	peerDependencies,
};

describe("fn: getDependencies", () => {
	it("returns an empty object when all settings is marked to be false", () => {
		expect(
			getDependencies(userDependencies, {
				dependencies: false,
				devDependencies: false,
				peerDependencies: false,
			}),
		).toEqual({});
	});

	describe("appConfig.dependencies", () => {
		it("returns an object containing all 'dependencies' when is true", () => {
			expect(
				getDependencies(userDependencies, {
					dependencies: true,
					devDependencies: true,
					peerDependencies: false,
				}),
			).toEqual(expect.objectContaining(dependencies));
		});

		it("returns an object without 'dependencies' when false", () => {
			expect(
				getDependencies(userDependencies, {
					dependencies: false,
					devDependencies: true,
					peerDependencies: false,
				}),
			).not.toEqual(expect.objectContaining(dependencies));
		});
	});

	describe("appConfig.devDependencies", () => {
		it("returns an object containing all 'devDependencies' when is true", () => {
			expect(
				getDependencies(userDependencies, {
					dependencies: true,
					devDependencies: true,
					peerDependencies: false,
				}),
			).toEqual(expect.objectContaining(devDependencies));
		});

		it("returns an object without 'devDependencies' when false", () => {
			expect(
				getDependencies(userDependencies, {
					dependencies: true,
					devDependencies: false,
					peerDependencies: false,
				}),
			).not.toEqual(expect.objectContaining(devDependencies));
		});
	});

	describe("appConfig.peerDependencies", () => {
		it("returns an object containing all 'peerDependencies' when is true", () => {
			expect(
				getDependencies(userDependencies, {
					dependencies: true,
					devDependencies: true,
					peerDependencies: true,
				}),
			).toEqual(expect.objectContaining(peerDependencies));
		});

		it("returns an object without 'peerDependencies' when false", () => {
			expect(
				getDependencies(userDependencies, {
					dependencies: true,
					devDependencies: false,
					peerDependencies: false,
				}),
			).not.toEqual(expect.objectContaining(peerDependencies));
		});
	});
});

describe("fn: filterUnpinnedDependencies", () => {
	const allDependencies = {
		...dependencies,
		...devDependencies,
		...peerDependencies,
	};

	it("returns an object only with the pinned dependencies", () => {
		expect(filterUnpinnedDependencies(allDependencies)).toEqual({
			bar: "^1.4",
			foobar: "^3.0.0",
		});
	});
});
