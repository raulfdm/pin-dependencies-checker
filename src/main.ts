import prettyJson from 'prettyjson';

import {
  isEmpty,
  getDependencies,
  filterUnpinnedDependencies,
} from './helpers';
import { appConfig } from './config';
import { getDependenciesFromPackageJson } from './dependencies';

const dependencies = getDependencies(
  getDependenciesFromPackageJson(),
  appConfig,
);

const unPinnedDependencies = filterUnpinnedDependencies(dependencies);

if (isEmpty(unPinnedDependencies)) {
  console.log('✔ Check! Everything is pinned');
  process.exit(0);
} else {
  console.log(
    '⚠ Hey! It seems that the following dependencies are not pinned:',
  );
  console.log(prettyJson.render(unPinnedDependencies));
  process.exit(1);
}
