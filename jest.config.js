module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true
      }
    }
  },
  collectCoverage: true,
  collectCoverageFrom: [
	"**/*.{vue,ts}",
	"!**/node_modules/**",
	"!**/*.d.ts",
	"!**/HelloWorld.vue"
  ]
}
