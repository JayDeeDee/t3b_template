module.exports = function(grunt) {
	'use strict';

	// Initialize all vars.
	var config = {},
			currentDate,
			packageIsDefault;

	// Project configuration.
	config = {
	  paths : {
			private:  'Resources/Private',
			public:   'Resources/Public',
			sass:     '<%= config.paths.private %>/Sass',
			css:      '<%= config.paths.public %>/Stylesheets',
			images:   '<%= config.paths.public %>/Images',
			privateJs:'<%= config.paths.private %>/Javascripts',
			publicJs: '<%= config.paths.public %>/Javascripts'
		},
		pkg: grunt.file.readJSON('package.json'), // Return all 'package.json' contents
		env: grunt.option('env') || 'dev' // Create an 'env' grunt option, if not specified in the bash this will return 'dev' as a standard.
	};

	// Display the execution time of grunt tasks
	require('time-grunt')(grunt);

	// Returns the current dateTime
	currentDate = grunt.template.today('dd-mm-yyyy hh:MM');

	// Check if the defaults in 'package.json' are customized.
	packageIsDefault = (config.pkg.name === 't3b_template') ? true : false;

	// Print out a warning message if the package.json contents aren't customized.
	if (packageIsDefault) {
		grunt.log.subhead('Please edit the package.json contents.');
	}

	// Print out a message which displays the specified env.
	grunt.log.subhead('Running Grunt-Tasks in "' + config.env + '" mode!');


	/**
	 * Project configuration.
	 */
	grunt.initConfig({
		// Passing some variables into the initConfig object.
		config: config,
		currentDate: currentDate,
		pkg: config.pkg,


		/**
		 * Grunt-Contrib-Compass
		 * Compiles .scss/.sass files to .css using Compass.
		 * https://github.com/gruntjs/grunt-contrib-compass
		 */
		compass: {
			options: {
				// Specify the config.rb filepath
				config: '<%= config.paths.sass %>/Config.rb',

				// Override Configuration paths as all grunt paths are relative to the Gruntfile
				sassDir: '<%= config.paths.sass %>',
				cssDir: '<%= config.paths.css %>',
				imagesDir: '<%= config.paths.images %>',
				javascriptsDir: '<%= config.paths.privateJs %>'
			},
			dev: {
				options: {
					outputStyle: 'compact',
					environment: 'development'
				}
			},
			prod: {
				options: {
					outputStyle: 'compressed',
					environment: 'production'
				}
			}
		},


		/**
		 * Grunt-Contrib-Clean
		 * Cleans files and folders.
		 * https://github.com/gruntjs/grunt-contrib-clean
		 */
		clean: {
			css: ['<%= config.paths.css %>/*.css']
		},


		/**
		 * Grunt-Replace
		 * Replace inline patterns with variables.
		 * https://npmjs.org/package/grunt-replace
		 */
		replace: {
			init: {
				src: [
					'**/*.php',
					'**/*.txt',
					'**/*.ts',
					'**/*.html',
					'**/*.scss',
					'!node_modules/**/*',
					'!<%= config.paths.privateJs %>/Libaries/**/*',
					'!<%= config.paths.publicJs %>/Libaries/**/*'
				],
				overwrite: true,
				replacements: [{
					from: '<!= pkg.name !>',
					to: '<%= pkg.name %>'
				}, {
					from: '<!= pkg.description !>',
					to: '<%= pkg.description %>'
				}, {
					from: '<!= pkg.homepage !>',
					to: '<%= pkg.homepage %>'
				}, {
					from: '<!= pkg.version !>',
					to: '<%= pkg.version %>'
				}, {
					from: '<!= pkg.author.name !>',
					to: '<%= pkg.author.name %>'
				}, {
					from: '<!= pkg.author.email !>',
					to: '<%= pkg.author.email %>'
				}, {
					from: '<!= date !>',
					to: '<%= currentDate %>'
				}]
			},
			deploy: {
				src: ['<%= config.paths.private %>/Layouts/*.html'],
				overwrite: true,
				replacements: [{
					from: '<%= modernizr.devFile %>',
					to: '<%= modernizr.outputFile %>'
				}]
			},
			dev: {
				src: ['<%= config.paths.private %>/Layouts/*.html'],
				overwrite: true,
				replacements: [{
					from: '<%= modernizr.outputFile %>',
					to: '<%= modernizr.devFile %>'
				}]
			}
		},


		/**
		 * Grunt-Modernizr
		 * Crawls through source files, gathers up references to Modernizr tests and outputs a clean Modernizr build.
		 * https://github.com/Modernizr/grunt-modernizr
		 */
		modernizr: {
			devFile: '<%= config.paths.privateJs %>/Libaries/Modernizr/modernizr.js',
			outputFile: '<%= config.paths.publicJs %>/Libaries/Modernizr-Custom.js',

			// Based on default settings on http://modernizr.com/download/
			extra: {
				shiv: true,
				printshiv: false,
				load: true,
				mq: false,
				cssclasses: true
			},
			// Based on default settings on http://modernizr.com/download/
			extensibility: {
				addtest: false,
				prefixed: false,
				teststyles: false,
				testprops: false,
				testallprops: false,
				hasevents: false,
				prefixes: false,
				domprefixes: false
			},
			files: [
				'**/*.{js,css,scss}',
				'!node_modules/**/*',
				'!Gruntfile.js',
				'!<%= path.privateJs %>/Libaries/**/*',
				'!<%= path.publicJs %>/Libaries/**/*'
			]
		},


		/**
		 * Grunt-Contrib-JSHint
		 * Validate files with JSHint.
		 * https://github.com/gruntjs/grunt-contrib-jshint
		 */
		jshint: {
			options: {
				// Environments
				browser: true,
				jquery: true,

				// Enforcing options
				camelcase: true,
				curly: true,
				devel: true,
				eqeqeq: true,
				eqnull: true,
				immed: true,
				latedef: true,
				undef: true,
				strict: true,
				newcap: true,
				noarg: true,
				expr: true,
				evil: true,
				smarttabs: true,

				// Use the stylish JSHint output
				reporter: require('jshint-stylish'),

				// Globals
				globals: {
					// Modernizr
					Modernizr: true,

					// RequireJS
					module: true,
					require: true,
					requirejs: true,
					define: true,
				}
			},
			files: [
				'Gruntfile.js',
				'<%= config.paths.privateJs %>/*.js',
				'!<%= config.paths.privateJs %>/Libaries/**/*',
				'!<%= config.paths.publicJs %>/Libaries/**/*'
			]
		},


		/**
		 * Grunt-CSS-Metrics
		 * Grunt task to analyse css files and log simple metrics.
		 * https://github.com/phamann/grunt-css-metrics
		 */
		cssmetrics: {
			common: {
				src: ['<%= config.paths.css %>/*.css'],
				options: {
					quiet: false,
					maxRules: 4096, // Maximum CSS rules which IE can handle http://goo.gl/irqrnO
					maxFileSize: 1048576 // 1 mb in bytes - A CSS file shouldn't exceed this limit.
				}
			}
		},


		/**
		 * Grunt-ImageOptim
		 * Lossless optimisation of images
		 * https://github.com/gruntjs/grunt-contrib-watch
		 */
		imageoptim: {
			files: [
				'<%= config.paths.images %>'
			],
			options: {
				imageAlpha: true,
				jpegMini: false,
				quitAfter: true
			}
		},


		/**
		 * Grunt-Shell
		 * Run shell commands.
		 * https://npmjs.org/package/grunt-shell
		 */
		shell: {
			hookUpGit: {
				command: 'rm -rf .git/hooks/ && mkdir .git/hooks/ && cp Build/Git-Hooks/pre-commit .git/hooks/',
				options: {
					stdout: true,
					stderr: true,
					failOnError: true
				},
			}
		},


		/**
		 * Grunt-Contrib-Watch
		 * Run tasks whenever watched files change.
		 * https://github.com/gruntjs/grunt-contrib-watch
		 */
		watch: {
			options: {
				nospawn: true
			},
			sass: {
				files: ['<%= config.paths.sass %>/**/*.scss'],
				tasks: ['compass:dev']
			},
			js: {
				files: ['<%= jshint.files %>'],
				tasks: ['jshint']
			}
		}
	});


	/**
	 * Load all grunt-plugins that are specified in the 'package.json' file.
	 */
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


	/**
	 * Default grunt task.
	 * Compiles all .scss/.sass files with ':dev' options and
	 * validates all js-files inside Resources/Private/Javascripts with JSHint.
	 */
	grunt.registerTask('default', ['compass:dev', 'jshint']);


	/**
	 * Initialize task.
	 * Replaces all t3b_template strings and other meta-data with the data
	 * specified inside the 'package.json'. (Should be run after downloading the extension).
	 */
	grunt.registerTask('init', function() {
		// Copy the git hooks as they are not present by default.
		grunt.task.run(['shell:hookUpGit']);

		// Check if the package.json contents are defaults; If 'false' replace all '<!=  !>' strings and set up the git hooks.
		if (!packageIsDefault) {
			grunt.task.run(['replace:init']);
		}

		// Create the base Stylesheet to prevent errors from ext:vhs(File not found).
		grunt.task.run(['compass:dev']);
	});


	/**
	 * Deploy task
	 * Recompiles all .scss/.sass files with ':prod' options (Minified), creates an
	 * custom Modernizr build and changes the affected paths in all Fluid Layouts.
	 */
	grunt.registerTask('deploy', ['clean:css', 'compass:prod', 'modernizr', 'replace:deploy']);


	/**
	 * UnDeploy task
	 * Revert all changes made by the deploy task.
	 */
	grunt.registerTask('undeploy', ['clean:css', 'compass:dev', 'replace:dev']);


	/**
	 * Travis CI task
	 * Replaces all replace strings with the standard meta data stored in the package.json
	 * and tests all JS files with JSHint, this task is used by Travis CI.
	 */
	grunt.registerTask('travis', ['replace:init', 'jshint']);
};
