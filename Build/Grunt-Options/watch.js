/**
 * Grunt-Contrib-Watch
 * @description Run tasks whenever watched files change.
 * @docs https://github.com/gruntjs/grunt-contrib-watch
 */

var config = require("../Config");

module.exports = {
	options: {
		nospawn: true
	},
	css: {
		files: [config.Sass.sassDir + "/**/*.scss"],
		tasks: ["compile:css"]
	},
	js: {
		files: ["<%= jshint.files %>"],
		tasks: ["jshint"]
	},
	docs: {
		files: ["Build/Templates/Kss-Node/**/*"],
		tasks: ["styleguide", "autoprefixer:docs"]
	}
};
