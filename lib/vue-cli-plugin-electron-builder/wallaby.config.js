module.exports = function (wallaby) {
  return {
    files: ['**/*.js'],

    tests: ['<rootDir>/__tests__/commands.spec.js'],
    env: {
      type: 'node',
      runner: 'node'
    },
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },

    testFramework: 'jest',
    setup: function (wallaby) {
      var jestConfig = require('./jest.config.js')
      // for example:
      // jestConfig.globals = { "__DEV__": true };
      wallaby.testFramework.configure(jestConfig)
    }
  }
}
