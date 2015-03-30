/**
 * Backgrid demo implementation of multiple plugins.
 */

// Helper functions
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var qs = (function(a) {
	if (a == "") return {};
	var b = {};
	for (var i = 0; i < a.length; ++i)
	{
		var p=a[i].split('=', 2);
		if (p.length == 1)
			b[p[0]] = "";
		else
			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	}
	return b;
})(window.location.search.substr(1).split('&'));

// Plugin settings
var pluginSettings = {
	// Official backgrid plugins
	"backgrid-paginator": true,
	"backgrid-filter": true,
	"backgrid-select-all": false,

	// Un-official backgrid plugins
	"backgrid-columnmanager": false,
	"backgrid-grouped-columns": false,
	"backgrid-sizeable-columns": false,
	"backgrid-orderable-columns": false
};

function initSettings() {
	// Check if there are any settings set at all in the GET parameters
	var params = qs;

	if (qs.length === 0) {
		// TODO: Check if there are saved settings

		return;
	}

	var overridden = false;
	_.each(params, function(query, key) {
		var value = query === "true";

		if (_.has(pluginSettings, key)) {
			overridden = true;
			pluginSettings[key] = value;
		}
	});

	if (overridden) {
		// Disable remaining plugins
		_.each(pluginSettings, function(value, key) {
			pluginSettings[key] = (_.has(qs, key)) ? value : false;
		});
	}
}
initSettings();

// Set checkbox values
function setCheckboxValues() {
	// Get all checkboxes and set selected value
	$("#pluginsettings input:checkbox").each(function(){
		var checkboxValue = $(this).val();

		if (_.has(pluginSettings, checkboxValue)) {
			$(this).prop('checked', pluginSettings[checkboxValue]);
		}
	});
}
setCheckboxValues();

// Create column collection
function getColumnCollection() {
	var extraSettings= {
		"id": {
			width: 50
		},
		"name": {
			width: 50
		},
		"pop": {
			width: 50
		},
		"percentage": {
			width: 50
		},
		"date": {
			width: 50
		},
		"url": {
			width: 50
		}
	};

	var columnDefinition = [{
		name: "id", // The key of the model attribute
		label: "ID", // The name to display in the header
		editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
		cell: Backgrid.IntegerCell.extend({
			orderSeparator: ""
		})
	}, {
		name: "name",
		label: "Name",
		cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
	}, {
		name: "pop",
		label: "Population",
		cell: "integer" // An integer cell is a number cell that displays humanized integers
	}, {
		name: "percentage",
		label: "% of World Population",
		cell: "number" // A cell type for floating point value, defaults to have a precision 2 decimal numbers
	}, {
		name: "date",
		label: "Date",
		cell: "date"
	}, {
		name: "url",
		label: "URL",
		cell: "uri" // Renders the value in an HTML anchor element
	}];

	if (pluginSettings["backgrid-columnmanager"]) {
		columnDefinition.push({
			label: "visibility",
			cell: "boolean",
			alwaysVisible: true,
			headerCell: Backgrid.Extension.ColumnManager.ColumnVisibilityHeaderCell
		});
	}

	return new Backgrid.Columns(columnDefinition);
}

// Render the grid
function renderGrid() {
	// Empty DOM
	$("#grid-container").empty();

	// Get column collection
	var columnCollection = getColumnCollection();

	// Setup data
	var data = [{"name": "Afghanistan", "url": "http://en.wikipedia.org/wiki/Afghanistan", "pop": 25500100, "date": "2013-01-01", "percentage": 0.36, "id": 1}, {"name": "Albania", "url": "http://en.wikipedia.org/wiki/Albania", "pop": 2831741, "date": "2011-10-01", "percentage": 0.04, "id": 2}, {"name": "Algeria", "url": "http://en.wikipedia.org/wiki/Algeria", "pop": 37100000, "date": "2012-01-01", "percentage": 0.53, "id": 3}, {"name": "American Samoa (USA)", "url": "http://en.wikipedia.org/wiki/American_Samoa", "pop": 55519, "date": "2010-04-01", "percentage": 0.00079, "id": 4}, {"name": "Andorra", "url": "http://en.wikipedia.org/wiki/Andorra", "pop": 78115, "date": "2011-07-01", "percentage": 0.0011, "id": 5}, {"name": "Angola", "url": "http://en.wikipedia.org/wiki/Angola", "pop": 20609294, "date": "2012-07-01", "percentage": 0.29, "id": 6}, {"name": "Anguilla (UK)", "url": "http://en.wikipedia.org/wiki/Anguilla", "pop": 13452, "date": "2011-05-11", "percentage": 0.00019, "id": 7}, {"name": "Antigua and Barbuda", "url": "http://en.wikipedia.org/wiki/Antigua_and_Barbuda", "pop": 86295, "date": "2011-05-27", "percentage": 0.0012, "id": 8}, {"name": "Argentina", "url": "http://en.wikipedia.org/wiki/Argentina", "pop": 40117096, "date": "2010-10-27", "percentage": 0.57, "id": 9}, {"name": "Armenia", "url": "http://en.wikipedia.org/wiki/Armenia", "pop": 3275700, "date": "2012-06-01", "percentage": 0.046, "id": 10}, {"name": "Aruba (Netherlands)", "url": "http://en.wikipedia.org/wiki/Aruba", "pop": 101484, "date": "2010-09-29", "percentage": 0.0014, "id": 11}, {"name": "Australia", "url": "http://en.wikipedia.org/wiki/Australia", "pop": 22808690, "date": "2012-11-11", "percentage": 0.32, "id": 12}, {"name": "Austria", "url": "http://en.wikipedia.org/wiki/Austria", "pop": 8452835, "date": "2012-07-01", "percentage": 0.12, "id": 13}, {"name": "Azerbaijan", "url": "http://en.wikipedia.org/wiki/Azerbaijan", "pop": 9235100, "date": "2012-01-01", "percentage": 0.13, "id": 14}, {"name": "Bahamas", "url": "http://en.wikipedia.org/wiki/The_Bahamas", "pop": 353658, "date": "2010-05-03", "percentage": 0.005, "id": 15}, {"name": "Bahrain", "url": "http://en.wikipedia.org/wiki/Bahrain", "pop": 1234571, "date": "2010-04-27", "percentage": 0.018, "id": 16}, {"name": "Bangladesh", "url": "http://en.wikipedia.org/wiki/Bangladesh", "pop": 152518015, "date": "2012-07-16", "percentage": 2.16, "id": 17}, {"name": "Barbados", "url": "http://en.wikipedia.org/wiki/Barbados", "pop": 274200, "date": "2010-07-01", "percentage": 0.0039, "id": 18}, {"name": "Belarus", "url": "http://en.wikipedia.org/wiki/Belarus", "pop": 9459000, "date": "2012-09-01", "percentage": 0.13, "id": 19}, {"name": "Belgium", "url": "http://en.wikipedia.org/wiki/Belgium", "pop": 10839905, "date": "2010-01-01", "percentage": 0.15, "id": 20}, {"name": "Belize", "url": "http://en.wikipedia.org/wiki/Belize", "pop": 312971, "date": "2010-05-12", "percentage": 0.0044, "id": 21}, {"name": "Benin", "url": "http://en.wikipedia.org/wiki/Benin", "pop": 9352000, "date": "2012-07-01", "percentage": 0.13, "id": 22}, {"name": "Bermuda (UK)", "url": "http://en.wikipedia.org/wiki/Bermuda", "pop": 64237, "date": "2010-05-20", "percentage": 0.00091, "id": 23}, {"name": "Bhutan", "url": "http://en.wikipedia.org/wiki/Bhutan", "pop": 720679, "date": "2012-07-01", "percentage": 0.01, "id": 24}, {"name": "Bolivia", "url": "http://en.wikipedia.org/wiki/Bolivia", "pop": 10426155, "date": "2010-07-01", "percentage": 0.15, "id": 25}, {"name": "Bosnia and Herzegovina", "url": "http://en.wikipedia.org/wiki/Bosnia_and_Herzegovina", "pop": 3868621, "date": "2012-06-30", "percentage": 0.055, "id": 26}, {"name": "Botswana", "url": "http://en.wikipedia.org/wiki/Botswana", "pop": 2024904, "date": "2011-08-22", "percentage": 0.029, "id": 27}, {"name": "Brazil", "url": "http://en.wikipedia.org/wiki/Brazil", "pop": 193946886, "date": "2012-07-01", "percentage": 2.75, "id": 28}, {"name": "British Virgin Islands (UK)", "url": "http://en.wikipedia.org/wiki/British_Virgin_Islands", "pop": 29537, "date": "2010-07-01", "percentage": 0.00042, "id": 29}, {"name": "Brunei", "url": "http://en.wikipedia.org/wiki/Brunei", "pop": 393162, "date": "2011-06-20", "percentage": 0.0056, "id": 30}, {"name": "Bulgaria", "url": "http://en.wikipedia.org/wiki/Bulgaria", "pop": 7364570, "date": "2011-02-01", "percentage": 0.1, "id": 31}];
	var dataCollection = (pluginSettings["backgrid-paginator"]) ?
		new Backbone.PageableCollection(data, {
			state: {
				pageSize: 15
			},
			mode: "client" // page entirely on the client side
		}) : new Backbone.Collection(data);

	// backgrid-columnmanager enabled?
	var colManager;
	if (pluginSettings["backgrid-columnmanager"]) {
		colManager = new Backgrid.Extension.ColumnManager(columnCollection, {
			initialColumnsVisible: 4
		});
	}

	// backgrid-filter enabled?
	if (pluginSettings["backgrid-filter"]) {
		// Initialize a client-side filter to filter on the client
		// mode pageable collection's cache.
		var filter = new Backgrid.Extension.ClientSideFilter({
			collection: dataCollection,
			fields: ['name']
		});

		// Render the filter
		$("#grid-container").append(filter.render().el);

		// Add some space to the filter and move it to the right
		$(filter.el).css({float: "right", margin: "20px"});
	}

	// Initialize a new Grid instance
	var grid = new Backgrid.Grid({
		columns: columnCollection,
		collection: dataCollection
	});

	// Render the grid
	var $grid = $("<div id='#grid'></div>").appendTo("#grid-container").append(grid.render().el);

	// backgrid-paginator enabled?
	if (pluginSettings["backgrid-paginator"]) {
		// Initialize the paginator
		var paginator = new Backgrid.Extension.Paginator({
			collection: dataCollection
		});

		// Render the paginator
		$grid.after(paginator.render().el);
	}
}

// Init
renderGrid();

// Watch for changes
// On change, change query string containing only activated plugins
$("#pluginsettings input:checkbox").change(function(){
	if (_.has(pluginSettings, $(this).val())) {
		// Update setting
		pluginSettings[$(this).val()] = $(this).prop('checked');

		// Create query string
		var queryString = $.param(pluginSettings);

		// Update query string (will re-render the page) if no pushState is available.
		document.location = "?" + queryString;
	}
});
