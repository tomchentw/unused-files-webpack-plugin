import {
  resolve as resolvePath,
} from "path";

import test from "tape";

import MemoryFS from "memory-fs";

import webpack from "webpack";

// eslint-disable-next-line import/no-duplicates
import UnusedFilesWebpackPlugin from "../index";
// eslint-disable-next-line import/no-duplicates, no-duplicate-imports
import { UnusedFilesWebpackPlugin as ufwpByProperty } from "../index";
// eslint-disable-next-line import/no-duplicates, no-duplicate-imports
import { default as ufwpByImportDefault } from "../index";
// eslint-disable-next-line import/no-duplicates, no-duplicate-imports
import * as ufwpModByStar from "../index";
const ufwpByRequire = require(`../index`);
const ufwpByRequireDefault = require(`../index`).default;

const EXPECTED_FILENAME_LIST = [
  `CHANGELOG.md`,
  `README.md`,
  `src/__tests__/index.spec.js`,
  `package.json`,
];

test(`UnusedFilesWebpackPlugin`, t => {
  const compiler = webpack({
    context: resolvePath(__dirname, `../../`),
    entry: {
      UnusedFilesWebpackPlugin: resolvePath(__dirname, `../index.js`),
    },
    output: {
      path: __dirname, // It will be in MemoryFS :)
    },
    plugins: [new UnusedFilesWebpackPlugin()],
  });
  compiler.outputFileSystem = new MemoryFS();

  compiler.run((err, stats) => {
    t.equal(err, null);

    const { warnings } = stats.compilation;
    t.equal(warnings.length, 1);

    const [unusedFilesError] = warnings;
    t.equal(unusedFilesError instanceof Error, true);

    const { message } = unusedFilesError;
    const containsExpected = EXPECTED_FILENAME_LIST.every(filename =>
      message.match(filename)
    );
    t.equal(containsExpected, true);

    t.end();
  });
});

test(`imports`, t => {
  t.equal(ufwpByProperty, UnusedFilesWebpackPlugin);
  t.equal(ufwpByRequire, UnusedFilesWebpackPlugin);
  t.equal(ufwpByRequireDefault, UnusedFilesWebpackPlugin);
  t.equal(ufwpByImportDefault, UnusedFilesWebpackPlugin);
  t.equal(ufwpModByStar.UnusedFilesWebpackPlugin, UnusedFilesWebpackPlugin);
  t.end();
});
