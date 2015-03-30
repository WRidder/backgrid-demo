"use strict";

var gulp = require("gulp");

// The default task
gulp.task("default", ["move-library"]);

gulp.task("move-library", function(cb) {
	// Vendor javascript
	gulp.src([
		"node_modules/jquery/dist/jquery.js",
		"node_modules/underscore/underscore.js",
		"node_modules/backbone/backbone.js",
		"node_modules/backgrid/lib/backgrid.js",
		"node_modules/bootstrap/dist/js/bootstrap.js",
		"node_modules/backbone.paginator/lib/backbone.paginator.js",
		"node_modules/backgrid-paginator/backgrid-paginator.js",
		"node_modules/backgrid-select-all/backgrid-select-all.js",
		"node_modules/backgrid-filter/backgrid-filter.js",
		"node_modules/backgrid-columnmanager/lib/Backgrid.ColumnManager.js",
		"node_modules/backgrid-grouped-columns/backgrid-grouped-columns.js",
		"node_modules/backgrid-sizeable-columns/backgrid-sizeable-columns.js",
		"node_modules/backgrid-orderable-columns/backgrid-orderable-columns.js"
	]).pipe(gulp.dest("vendor/js"));

	// Vendor css
	gulp.src([
		"node_modules/normalize.css/normalize.css",
		"node_modules/bootstrap/dist/css/bootstrap.css",
		"node_modules/backgrid/lib/backgrid.css",
		"node_modules/backgrid-paginator/backgrid-paginator.css",
		"node_modules/backgrid-filter/backgrid-filter.css",
		"node_modules/backgrid-select-all/backgrid-select-all.css",
		"node_modules/backgrid-columnmanager/lib/Backgrid.ColumnManager.css",
		"node_modules/backgrid-grouped-columns/backgrid-grouped-columns.css",
		"node_modules/backgrid-sizeable-columns/backgrid-sizeable-columns.css",
		"node_modules/backgrid-orderable-columns/backgrid-orderable-columns.css"
	]).pipe(gulp.dest("vendor/css"));
	cb();
});