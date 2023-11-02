import parseArguments from "yargs-parser";
import { z } from "zod";

const argv = parseArguments(process.argv.slice(2));

const CliConfig = z.object({
	peerDeps: z.boolean().default(false),
	deps: z.boolean().default(true),
	devDeps: z.boolean().default(true),
	optionalDeps: z.boolean().default(false),
});

export type CliConfigType = z.infer<typeof CliConfig>;

export const cliConfig = CliConfig.parse(argv);
