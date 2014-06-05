/* jshint node:true */
module.exports = function(grunt) {

	// Load tasks.
	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	// Project configuration.
	grunt.initConfig({
		sass: {
			dev: {
				options: {
					noCache: false,
					sourcemap: true
				},
				files: {
					'style.css' : 'assets/sass/style.scss'
				}
			}
		},
		jshint: {
			options: grunt.file.readJSON( '.jshintrc' ),
			grunt: {
				src: [ 'Gruntfile.js' ]
			},
			tests: {
				src: [
					'app/tests/**/*.js'
				],
				options: grunt.file.readJSON( 'app/tests/.jshintrc' )
			},
			core: {
				src: [
					'app/js/*.js'
				]
			}
		},
		uglify: {
			js: {
				options: {
					sourceMap: true
				},
				files: {
					'app/build/js/wp-api.min.js': [
						'app/js/app.js',
						'app/js/utils.js',
						'app/js/models.js',
						'app/js/collections.js',
						'app/js/views.js'
					]
				}
			}
		},
		concat: {
			js: {
				src: [
					'app/js/app.js',
					'app/js/utils.js',
					'app/js/models.js',
					'app/js/collections.js',
					'app/js/views.js'
				],
				dest: 'app/build/js/wp-api.js'
			}
		},
		qunit: {
			all: [ 'app/tests/*.html' ]
		},
		watch: {
			dev: {
				files: [ 'assets/sass/**' ],
				tasks: [ 'sass:dev' ]
			},
			js: {
				files: [ 'app/js/*.js' ],
				tasks: [ 'concat' ]
			}
		}
	});

	// Default task.
	grunt.registerTask( 'js', [ 'uglify:js', 'concat:js' ] );
	grunt.registerTask( 'css', [ 'sass:dev' ] );
	grunt.registerTask( 'default', [ 'js', 'css' ] );
	grunt.registerTask( 'test', [ 'qunit:all' ] );

};
