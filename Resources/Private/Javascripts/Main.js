/**
 * RequireJS configuration
 * @description Pass in options for RequireJS like paths, shims or the baseUrl
 */
require.config({
	paths: {
		"main" : "Modules/Main"
	},
	include: ["main"], // Array of entry points which should be included in the optimized final build.

	// Append a date on each requested script to prevent caching issues.
	urlArgs: "bust=" + (new Date()).getDate()
});


/**
 * RequireJS calls
 * @description Call the needed AMD modules.
 */
require(["main"], function(MainFn) {
	"use strict";

	new MainFn();
});
