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
					sourcemap: true,
					style: 'expanded'
				},
				files: {
					'assets/style.css' : 'assets/sass/style.scss'
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: ['Android >= 2.1', 'Chrome >= 21', 'Explorer >= 7', 'Firefox >= 17', 'Opera >= 12.1', 'Safari >= 6.0']
				// browsers: ['last 2 version', 'ie 8', 'ie 9']
			},
			dev: {
				src:  'assets/style.css',
				dest: 'style.css'
			},
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
				tasks: [ 'sass:dev', 'autoprefixer:dev' ]
			},
			js: {
				files: [ 'app/js/*.js' ],
				tasks: [ 'concat' ]
			}
		}
	});

	// Default task.
	grunt.registerTask( 'js', [ 'uglify:js', 'concat:js' ] );
	grunt.registerTask( 'css', [ 'sass:dev', 'autoprefixer:dev' ] );
	grunt.registerTask( 'default', [ 'js', 'css' ] );
	grunt.registerTask( 'test', [ 'qunit:all' ] );

};
