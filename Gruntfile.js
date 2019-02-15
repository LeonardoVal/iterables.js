/** Gruntfile for [creatartis-base](http://github.com/LeonardoVal/list-utils.js).
*/
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	});

	require('creatartis-grunt').config(grunt, {
		globalName: 'list_utils',
		sourceNames: ['__prologue__',
			'_utils', 'core',
			'empty', 'singletons', 'strings', 'arrays', 'objects', 
			'builders',
			'selections', 'maps', 'folds', 'tuples', 'indices',
			'combinatorics',
			'__epilogue__'],
		deps: [
			{ id: 'tests-common', path: 'build/tests-common.js', dev: true, module: false }
		],
		copy: {
			'build/': 'src/tests-common.js'
		},
		jshint: { loopfunc: true, boss: true, evil: true, proto: true },
		karma: ['Firefox', 'Chrome'],
		connect: {
			console: 'tests/console.html'
		}
	});

	grunt.registerTask('full-test', ['test', 'karma:test_chrome']);
	grunt.registerTask('default', ['build']);
};
