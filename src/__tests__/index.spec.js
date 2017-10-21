import path from "path";
import MemoryFS from "memory-fs";
import webpack from "webpack";
import UnusedFilesWebpackPlugin from "../index";

const EXPECTED_FILENAME_LIST = [
  `CHANGELOG.md`,
  `README.md`,
  `src/__tests__/index.spec.js`,
  `package.json`
];

describe(`UnusedFilesWebpackPlugin module`, () => {
  it(`should work as expected`, done => {
    const compiler = webpack({
      context: path.resolve(__dirname, `../../`),
      entry: {
        UnusedFilesWebpackPlugin: path.resolve(__dirname, `../index.js`)
      },
      output: {
        path: __dirname // It will be in MemoryFS :)
      },
      plugins: [new UnusedFilesWebpackPlugin()]
    });
    compiler.outputFileSystem = new MemoryFS();

    compiler.run((err, stats) => {
      expect(err).toBeFalsy();

      const { warnings } = stats.compilation;
      expect(warnings).toHaveLength(1);

      const [unusedFilesError] = warnings;
      expect(unusedFilesError).toBeInstanceOf(Error);

      const { message } = unusedFilesError;
      const containsExpected = EXPECTED_FILENAME_LIST.every(filename =>
        message.match(filename)
      );
      expect(containsExpected).toBeTruthy();

      done();
    });
  });
});
