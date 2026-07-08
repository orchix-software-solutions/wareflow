module.exports = {
  root: true,
  extends: [require.resolve("@wareflow/config/eslint")],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
