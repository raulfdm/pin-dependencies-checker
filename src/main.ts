#!/bin/node
import { appConfig } from "./config";
import { getDependenciesFromPackageJson } from "./dependencies";
import {
	filterUnpinnedDependencies,
	getDependencies,
	isEmpty,
} from "./helpers";

const dependencies = getDependencies(
	getDependenciesFromPackageJson(),
	appConfig,
);

const unPinnedDependencies = filterUnpinnedDependencies(dependencies);

if (isEmpty(unPinnedDependencies)) {
	console.log("✅ Check! Everything is pinned");
} else {
	console.log("⚠️Hey! It seems that the following dependencies are not pinned:");
	console.log(JSON.stringify(unPinnedDependencies, null, 2));
	console.log("Try to resolve that first! 👮👮");
	process.exit(1);
}
