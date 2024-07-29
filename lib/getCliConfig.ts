import { parseArgs } from "node:util";
import type { RequiredDeep } from "type-fest";

/**
 * Even when we specify the default value, parseArgs will return
 * a type of `boolean | undefined` for the option.
 *
 * Here we just ensure to TS that the type will be a boolean `boolean`.
 */
export type CliConfigType = RequiredDeep<ReturnType<typeof getCliConfig>>;

export function getCliConfig() {
	const { values } = parseArgs({
		args: process.argv.slice(2),
		options: {
			"ignore-workspaces": {
				type: "boolean",
				default: false,
			},
			"ignore-catalog": {
				type: "boolean",
				default: false,
			},
			"no-deps": {
				type: "boolean",
				default: false,
			},
			"no-dev-deps": {
				type: "boolean",
				default: false,
			},
			"optional-deps": {
				type: "boolean",
				default: false,
			},
			"peer-deps": {
				type: "boolean",
				default: false,
			},
		},
	});

	return values;
}
