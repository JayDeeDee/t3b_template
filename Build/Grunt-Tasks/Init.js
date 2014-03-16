/**
 * Initialize task.
 * Replaces all t3b_template strings and other meta-data with the data
 * specified inside the 'package.json'. (Should be run after downloading the extension).
 */

var config = require("../Config");

module.exports = function(grunt) {
	"use strict";

	grunt.registerTask("init", function() {
		/*
		 * Check if the package.json contents are defaults; If 'false'
		 *		=> replace all '<!=  !>' strings and set up the git hooks.
		 *		=> remove the default git history.
		 */
		if (!config.packageIsDefault) {
			grunt.task.run(["replace:init", "clean:gitFolder"]);
		} else {
			// Copy the git hooks as they are not present by default.
			grunt.task.run(["shell:hookUpGit"]);
		}

		// Create the base Stylesheet to prevent errors from ext:vhs(File not found).
		grunt.task.run(["compass:dev"]);
	});
};
