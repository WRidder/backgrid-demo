(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("jQuery"), require("Backbone"), require("Backgrid"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "jQuery", "Backbone", "Backgrid"], factory);
	else if(typeof exports === 'object')
		exports["Backgrid.Extension.AdvancedFilter"] = factory(require("_"), require("jQuery"), require("Backbone"), require("Backgrid"));
	else
		root["Backgrid.Extension.AdvancedFilter"] = factory(root["_"], root["jQuery"], root["Backbone"], root["Backgrid"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * A column manager for backgrid
	 *
	 * @module AdvancedFilter
	 */
	var Backgrid = __webpack_require__(5);

	// Setup root object
	Backgrid.Extension.AdvancedFilter = {
	  SubComponents: {}
	};

	// Require submodules
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(1);
	__webpack_require__(10);
	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(14);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * A column manager for backgrid
	 *
	 * @module AdvancedFilter.Editor
	 */
	var _ = __webpack_require__(2);
	var $ = __webpack_require__(3);
	var Backbone = __webpack_require__(4);
	var Backgrid = __webpack_require__(5);

	var ButtonView = Backbone.View.extend({
	  tagName: "button",
	  defaults: {
	    buttonText: "",
	    buttonClass: ""
	  },
	  events: {
	    "click": "clickHandler"
	  },
	  initialize: function(options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Input argument checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("ButtonView: No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;

	    if (!self.options.filter ||
	      !self.options.filter instanceof Backbone.Model) {
	      throw new Error("ButtonView: No (valid) attribute filter model provided");
	    }
	    self.filter = self.options.filter;
	  },
	  render: function() {
	    var self = this;
	    self.$el.empty();

	    // Add class
	    self.$el.addClass(self.options.buttonClass);

	    // Set text
	    self.$el.text(self.options.buttonText);

	    return self;
	  },

	  clickHandler: function(e) {
	    var self = this;
	    self.stopPropagation(e);
	  },

	  /**
	   * Convenience function to stop event propagation
	   *
	   * @method stopPropagation
	   * @param {object} e
	   * @private
	   */
	  stopPropagation: function (e) {
	    e.stopPropagation();
	    e.stopImmediatePropagation();
	    e.preventDefault();
	  }
	});

	/**
	 * @class NewFilterButtonView
	 * @extends Backbone.View
	 */
	var NewFilterButtonView = ButtonView.extend({
	  defaults: {
	    buttonText: "+",
	    buttonClass: "new-attribute-filter"
	  },
	  clickHandler: function(e) {
	    var self = this;
	    self.stopPropagation(e);

	    // Get current filter
	    var fsm = self.filterStateModel;
	    var activeFilter = fsm.getActiveFilter();
	    activeFilter.get("attributeFilters").createNewAttributeFilter();
	  }
	});

	/**
	 * @class RemoveFilterButtonView
	 * @extends Backbone.View
	 */
	var RemoveFilterButtonView = ButtonView.extend({
	  defaults: {
	    buttonText: "-",
	    buttonClass: "remove-attribute-filter"
	  },
	  clickHandler: function(e) {
	    var self = this;
	    self.stopPropagation(e);

	    // Get current filter
	    var fsm = self.filterStateModel;
	    var filterId = fsm.get("activeFilterId");
	    var activeFilter = fsm.get("filterCollection").get(filterId);
	    activeFilter.get("attributeFilters").remove(self.filter);
	  }
	});

	var ColumnSelectorView = Backbone.View.extend({
	  className: "column-selector",
	  tagName: "select",
	  initFinished: false,
	  defaults: {
	    placeHolderText: "Select column..."
	  },
	  events: {
	    "change": "columnUpdate"
	  },

	  initialize: function(options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Input argument checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("ColumnSelectorView: No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;

	    if (!self.options.filter ||
	      !self.options.filter instanceof Backbone.Model) {
	      throw new Error("ColumnSelectorView: No (valid) attribute filter model provided");
	    }
	    self.filter = self.options.filter;
	  },

	  render: function() {
	    var self = this;

	    // Get filter options
	    var filterOptions = self.filterOptions = self.filterStateModel.getFilterableColumns();

	    // Add placeholder
	    self.$el.append("<option value=\"\"disabled selected>" + self.options.placeHolderText + "</option>");

	    // Add select options
	    _.each(filterOptions, function(col, name) {
	      self.$el.append($("<option></option>")
	        .attr("value", name)
	        .text(col.label));
	    });

	    // Set current value
	    if (_.has(filterOptions, self.filter.get("column"))) {
	      self.$el.val(self.filter.get("column"));
	    }

	    self.initFinished = true;
	    return self;
	  },

	  /**
	   * @method columnUpdate
	   */
	  columnUpdate: function() {
	    var self = this;
	    if (self.initFinished) {
	      var column = self.$el.val();
	      var type = self.filterOptions[column].filterType;
	      self.filter.set({
	        column: column,
	        type: type
	      });
	    }
	  }
	});

	/**
	 * @class MatcherSelectorView
	 */
	var MatcherSelectorView = Backbone.View.extend({
	  tagName: "select",
	  events: {
	    "change": "matcherUpdate"
	  },
	  defaults: {
	    placeHolderText: "select a method..."
	  },

	  initialize: function(options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Input argument checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("ColumnSelectorView: No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;

	    if (!self.options.filter ||
	      !self.options.filter instanceof Backbone.Model) {
	      throw new Error("ColumnSelectorView: No (valid) attribute filter model provided");
	    }
	    self.filter = self.options.filter;
	  },

	  render: function() {
	    var self = this;

	    // Get filter options
	    var filterOptions = self.filterOptions = self.filterStateModel.getMatchers(self.filter.get("type"));

	    // Add placeholder
	    self.$el.append("<option value=\"\"disabled selected>" + self.options.placeHolderText + "</option>");

	    // Add select options
	    _.each(filterOptions, function(matcher, name) {
	      self.$el.append($("<option></option>")
	        .attr("value", name)
	        .text(matcher.label));
	    });

	    // Set current value
	    if (_.has(filterOptions, self.filter.get("matcher"))) {
	      self.$el.val(self.filter.get("matcher"));
	    }

	    return self;
	  },

	  /**
	   * @method matcherUpdate
	   */
	  matcherUpdate: function() {
	    var self = this;
	    self.filter.set("matcher", self.$el.val());
	  }
	});

	var SingleValueBoolView = Backbone.View.extend({
	  className: "single-value-bool",
	  tagName: "select",
	  events: {
	    "change": "valueUpdate"
	  },
	  defaults: {
	    placeHolderText: "select true or false"
	  },

	  initialize: function(options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Input argument checking
	    if (!self.options.filter ||
	      !self.options.filter instanceof Backbone.Model) {
	      throw new Error("No (valid) filter state model provided");
	    }
	    self.filter = self.options.filter;
	  },

	  /**
	   * @method render
	   * @return {ValueView}
	   */
	  render: function() {
	    var self = this;
	    self.$el.empty();

	    // Add placeholder
	    self.$el.append("<option value=\"\"disabled selected>" + self.options.placeHolderText + "</option>");

	    // Add select options
	    self.$el.append($("<option></option>")
	      .attr("value", true)
	      .text("true"));

	    self.$el.append($("<option></option>")
	      .attr("value", false)
	      .text("false"));

	    // Set current value
	    var currentValue = self.filter.get("value");
	    if (currentValue === true || currentValue === false) {
	      self.$el.val(currentValue);
	    }
	    return self;
	  },

	  valueUpdate: function() {
	    var self = this;
	    self.filter.set("value", self.$el.val());
	  }
	});

	var SingleValueTextView = Backbone.View.extend({
	  className: "single-value-text",
	  tagName: "input",
	  events: {
	    "change": "valueUpdate"
	  },

	  initialize: function(options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Input argument checking
	    if (!self.options.filter ||
	      !self.options.filter instanceof Backbone.Model) {
	      throw new Error("No (valid) filter state model provided");
	    }
	    self.filter = self.options.filter;
	  },

	  /**
	   * @method render
	   * @return {ValueView}
	   */
	  render: function() {
	    var self = this;
	    self.$el.empty();

	    self.$el.val(self.filter.get("value"));
	    return self;
	  },

	  valueUpdate: function() {
	    var self = this;
	    self.filter.set("value", self.$el.val());
	  }
	});


	var DoubleValueTextView = Backbone.View.extend({
	  className: "double-value-text-container",
	  tagName: "div",
	  template: _.template("" +
	    "<input class=\"double-value-text\"/>" +
	    "<input class=\"double-value-text\"/>" +
	    ""),
	  events: {
	    "change": "valueUpdate"
	  },

	  initialize: function(options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Input argument checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("MatcherSelectorView: No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;

	    if (!self.options.filter ||
	      !self.options.filter instanceof Backbone.Model) {
	      throw new Error("No (valid) filter state model provided");
	    }
	    self.filter = self.options.filter;

	    // Get parser
	    self.valueParser = self.filterStateModel.getValueParser(self.filter.get("type"));
	  },

	  /**
	   * @method render
	   * @return {ValueView}
	   */
	  render: function() {
	    var self = this;
	    self.$el.empty();

	    // Render template
	    self.$el.append(self.template());

	    // Set values
	    var currentValue = self.filter.get("value");
	    if (_.isArray(currentValue) && currentValue.length === 2) {
	      // Set values
	      self.$el.find("input").first().val(currentValue[0]);
	      self.$el.find("input").last().val(currentValue[1]);
	    }

	    self.$el.val(self.filter.get("value"));
	    return self;
	  },

	  valueUpdate: function() {
	    var self = this;

	    // Get values
	    var values = [
	      self.valueParser(self.$el.find("input").first().val()),
	      self.valueParser(self.$el.find("input").last().val())
	    ];

	    // Save values
	    self.filter.set("value", values);
	  }
	});

	var ValueContainerView = Backbone.View.extend({
	  className: "value-container",
	  tagName: "div",
	  defaults: {
	    SingleValueTextView: SingleValueTextView,
	    DoubleValueTextView: DoubleValueTextView,
	    SingleValueBoolView: SingleValueBoolView
	  },

	  initialize: function(options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});
	    self.childView = null;

	    // Input argument checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("MatcherSelectorView: No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;

	    if (!self.options.filter ||
	      !self.options.filter instanceof Backbone.Model) {
	      throw new Error("No (valid) filter state model provided");
	    }
	    self.filter = self.options.filter;

	    // Events
	    self.listenTo(self.filter, "change:matcher", self.render);
	  },

	  /**
	   * @method render
	   * @return {ColumnFilter}
	   * @chainable
	   */
	  render: function() {
	    var self = this;

	    // Cleanup
	    if (self.childView) {
	      self.childView.remove();
	      self.childView = null;
	    }

	    if (self.filter.get("matcher") && self.filter.get("type")) {
	      var inputTypeInfo = self.filterStateModel.
	        getInputTypeInfoForMatcher(self.filter.get("matcher"), self.filter.get("type"));

	      if (inputTypeInfo.valueType === "single" && inputTypeInfo.inputType === "textbox") {
	        self.childView = new self.options.SingleValueTextView({
	          filter: self.filter,
	          filterStateModel: self.filterStateModel
	        });
	        self.$el.append(self.childView.render().$el);
	      }

	      if (inputTypeInfo.valueType === "array2" && inputTypeInfo.inputType === "textbox") {
	        self.childView = new self.options.DoubleValueTextView({
	          filter: self.filter,
	          filterStateModel: self.filterStateModel
	        });
	        self.$el.append(self.childView.render().$el);
	      }

	      if (inputTypeInfo.valueType === "single" && inputTypeInfo.inputType === "boolean-select") {
	        self.childView = new self.options.SingleValueBoolView({
	          filter: self.filter,
	          filterStateModel: self.filterStateModel
	        });
	        self.$el.append(self.childView.render().$el);
	      }
	    }

	    return self;
	  },

	  remove: function() {
	    var self = this;

	    // Remove childview
	    if (self.childView) {
	      self.childView.remove();
	    }

	    // Invoke original backbone methods
	    return Backbone.View.prototype.remove.apply(self, arguments);
	  }
	});

	/**
	 * @class MatcherContainerView
	 * @extends Backbone.View
	 */
	var MatcherContainerView = Backbone.View.extend({
	  className: "matcher-container",
	  tagName: "div",
	  template: _.template("" +
	    "<div class=\"matcher-selector\"></div>" +
	    "<div class=\"matcher-value\"></div>" +
	    "<div class=\"clearer\"></div>" +
	    ""
	  ),
	  defaults: {
	    MatcherSelectorView: MatcherSelectorView,
	    ValueContainerView: ValueContainerView
	  },

	  initialize: function(options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});
	    self.childViews = {};

	    // Input argument checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("MatcherSelectorView: No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;

	    if (!self.options.filter ||
	      !self.options.filter instanceof Backbone.Model) {
	      throw new Error("No (valid) filter state model provided");
	    }
	    self.filter = self.options.filter;

	    // Events
	    self.listenTo(self.filter, "change:column", self.render);
	    self.listenTo(self.filter, "change:matcher", self.renderValueView);
	  },

	  /**
	   * @method render
	   * @return {ColumnFilter}
	   */
	  render: function() {
	    var self = this;
	    self.$el.empty();

	    // Render template
	    self.$el.append(self.template());

	    // Add sub components
	    self.renderSubComponent(".matcher-selector", self.options.MatcherSelectorView);
	    self.renderValueView();

	    return self;
	  },

	  renderValueView: function() {
	    var self = this;
	    if (self.filter.get("matcher")) {
	      self.renderSubComponent(".matcher-value", self.options.ValueContainerView);
	    }
	  },

	  /**
	   * @method renderSubcomponent
	   * @param className
	   * @param View
	   */
	  renderSubComponent: function(className, View) {
	    var self = this;
	    var $container = self.$el.find("> div" + className);

	    // Check if child already exists, if so, remove
	    if (self.childViews[className]) {
	      self.childViews[className].remove();
	    }

	    // Add column selector
	    self.childViews[className] = new View({
	      filterStateModel: self.filterStateModel,
	      filter: self.filter
	    });
	    $container.append(self.childViews[className].render().$el);
	  },

	  /**
	   * @method remove
	   * @return {*}
	   */
	  remove: function() {
	    var self = this;

	    // Remove childviews
	    _.each(self.childViews, function(view) {
	      view.remove();
	    });

	    // Invoke original backbone methods
	    return Backbone.View.prototype.remove.apply(self, arguments);
	  }
	});

	/**
	 * @class ColumnFilterView
	 * @extends Backbone.View
	 */
	var ColumnFilterView = Backbone.View.extend({
	  className: "columnfilter",
	  tagName: "div",
	  template: _.template("" +
	    "<div class=\"columnfilter-column\"></div>" +
	    "<div class=\"columnfilter-matcher\"></div>" +
	    "<div class=\"clearer\"></div>" +
	    ""
	  ),
	  events: {
	    "change": "columnUpdate"
	  },
	  defaults: {
	    ColumnSelectorView: ColumnSelectorView,
	    MatcherContainerView: MatcherContainerView
	  },

	  /**
	   * @method initialize
	   * @param options
	   */
	  initialize: function(options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Input argument checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("ColumnFilter: No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;

	    if (!self.options.filter ||
	      !self.options.filter instanceof Backbone.Model) {
	      throw new Error("ColumnFilter: No (valid) filter model provided");
	    }
	    self.filter = self.options.filter;

	    // Events
	    self.listenTo(self.filter, "change:column", self.renderSubComponents);
	  },

	  /**
	   * @method render
	   * @return {ColumnFilter}
	   */
	  render: function() {
	    var self = this;
	    self.$el.empty();

	    // Render template
	    self.$el.append(self.template());

	    // Render sub components
	    self.renderSubComponents();

	    return self;
	  },

	  renderSubComponents: function() {
	    var self = this;

	    // Add sub components
	    if (!self.colSelectorRendered) {
	      self.renderSubComponent(".columnfilter-column", self.options.ColumnSelectorView);
	      self.colSelectorRendered = true;
	    }
	    if (!self.matcherRendered && self.filter.get("type")) {
	      self.renderSubComponent(".columnfilter-matcher", self.options.MatcherContainerView);
	      self.matcherRendered = true;
	    }
	  },

	  /**
	   * @method renderSubcomponent
	   * @param className
	   * @param View
	   */
	  renderSubComponent: function(className, View) {
	    var self = this;
	    var $container = self.$el.find("> div" + className);
	    $container.empty();

	    // Add column selector
	    var subView = new View({
	      filter: self.filter,
	      filterStateModel: self.filterStateModel
	    });
	    $container.append(subView.render().$el);
	  }
	});

	/**
	 * @class FilterView
	 * @extends Backbone.View
	 */
	Backgrid.Extension.AdvancedFilter.SubComponents.FilterView = Backbone.View.extend({
	  className: "filter-editor",
	  tagName: "div",
	  template: _.template("" +
	    "<div class=\"filter-editor-columnfilter\"></div>" +
	    "<div class=\"filter-editor-addremove\"></div>" +
	    "<div class=\"clearer\"></div>" +
	  ""),
	  defaults: {
	    ColumnFilterView: ColumnFilterView,
	    NewFilterButtonView: NewFilterButtonView,
	    RemoveFilterButtonView: RemoveFilterButtonView
	  },

	  /**
	   * @method initialize
	   * @param options
	   */
	  initialize: function(options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Input argument checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;

	    if (!self.options.attributeFilter ||
	      !self.options.attributeFilter instanceof Backbone.Model) {
	      throw new Error("No (valid) filter state model provided");
	    }
	    self.filter = self.options.attributeFilter;

	    // Events
	    self.listenTo(self.filter, "change:valid", self.setValidClass);
	  },

	  /**
	   * @method render
	   * @return {FilterView}
	   */
	  render: function() {
	    var self = this;
	    self.$el.empty();

	    // Render template
	    self.$el.append(self.template());

	    // Add column selector
	    var columnFilterView = new this.options.ColumnFilterView({
	      filterStateModel: self.filterStateModel,
	      filter: self.filter
	    });
	    self.$el.find(".filter-editor-columnfilter").append(columnFilterView.render().$el);

	    // Add attribute filter view
	    var addAttributeFilterView = new this.options.NewFilterButtonView({
	      filterStateModel: self.filterStateModel,
	      filter: self.filter
	    });
	    self.$el.find(".filter-editor-addremove").append(addAttributeFilterView.render().$el);

	    var removeAttributeFilterView = new this.options.RemoveFilterButtonView({
	      filterStateModel: self.filterStateModel,
	      filter: self.filter
	    });
	    self.$el.find(".filter-editor-addremove").append(removeAttributeFilterView.render().$el);

	    // Set valid class
	    self.setValidClass();

	    return self;
	  },

	  /**
	   * Adds an 'active' class to the view element if the attribute filter is valid.
	   * @method setValidClass
	   */
	  setValidClass: function() {
	    var self = this;

	    if (self.filter.get("valid")) {
	      self.$el.removeClass("invalidvalid");
	      self.$el.addClass("valid");
	    }
	    else {
	      self.$el.removeClass("valid");
	      self.$el.addClass("invalid");
	    }
	  }
	});

	/**
	 *
	 * @class AdvancedFilter.Editor
	 * @extends Backbone.View
	 */
	Backgrid.Extension.AdvancedFilter.Editor = Backbone.View.extend({
	  className: "advancedfilter-editor",
	  tagName: "div",
	  defaults: {
	    NewFilterButtonView: NewFilterButtonView
	  },

	  /**
	   * @method initialize
	   * @param options
	   */
	  initialize: function (options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Input argument checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;

	    self.listenTo(self.filterStateModel, "change:activeFilterId", self.bindFilter);
	    self.bindFilter();
	  },

	  bindFilter: function() {
	    var self = this;

	    // Get current filter
	    var fsm = self.filterStateModel;
	    var filterId = fsm.get("activeFilterId");

	    // Unbind from previous filter if necessary
	    if (self.activeFilter && fsm.get("filterCollection").contains(self.activeFilter)) {
	      self.stopListening(self.activeFilter.get("attributeFilters"));
	    }

	    if (filterId) {
	      self.activeFilter = fsm.get("filterCollection").get(filterId);

	      // Add event listener to attribute filter collection
	      self.listenTo(self.activeFilter.get("attributeFilters"), "add remove reset", self.render);
	    }
	    else {
	      self.activeFilter = null;
	    }

	    self.render();
	  },

	  /**
	   * @method render
	   * @return {AdvancedFilter.Editor}
	   * @chainable
	   */
	  render: function() {
	    var self = this;
	    self.$el.empty();

	    if (self.activeFilter) {
	      var af = self.activeFilter;

	      // Loop filters
	      if (af.get("attributeFilters").length > 0) {
	        af.get("attributeFilters").each(function(attributeFilter) {
	          var filterView = new Backgrid.Extension.AdvancedFilter.SubComponents.FilterView({
	            filterStateModel: self.filterStateModel,
	            attributeFilter: attributeFilter
	          });

	          self.$el.append(filterView.render().$el);
	        });
	      }
	      else {
	        // No filters available, render single 'add filter' button
	        var newFilterButtonView = new self.options.NewFilterButtonView({
	          filterStateModel: self.filterStateModel,
	          filter: self.activeFilter
	        });
	        self.$el.append(newFilterButtonView.render().$el);
	      }
	    }

	    return self;
	  }
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * Filter collection definition
	 *
	 * @module AdvancedFilter.FilterOptions
	 */
	var Backgrid = __webpack_require__(5);
	var _ = __webpack_require__(2);
	Backgrid.Extension.AdvancedFilter.FilterOptions = {};

	/**
	 * MatchersValueTypeValidator
	 * @property MatchersValueTypeValidator
	 */
	Backgrid.Extension.AdvancedFilter.FilterOptions.MatchersValueTypeValidator = {
	  single: function(value) {
	    return !_.isUndefined(value) && !_.isNull(value)
	      && !_.isArray(value) && !_.isFunction(value);
	  },
	  array2: function(value) {
	    return _.isArray(value) && value.length === 2;
	  }
	};

	/**
	 * Matchers
	 * @property Matchers
	 */
	Backgrid.Extension.AdvancedFilter.FilterOptions.Matchers = {
	  "gt": {
	    name: "greater than",
	    valueType: "single"
	  },
	  "gte": {
	    name: "greater than or equal",
	    valueType: "single"
	  },
	  "lt": {
	    name: "lower than",
	    valueType: "single"
	  },
	  "lte": {
	    name: "lower than or equal",
	    valueType: "single"
	  },
	  "eq": {
	    name: "equals",
	    valueType: "single"
	  },
	  "neq": {
	    name: "does not equal",
	    valueType: "single"
	  },
	  "sw": {
	    name: "starts with",
	    valueType: "single"
	  },
	  "ew": {
	    name: "ends with",
	    valueType: "single"
	  },
	  "ct": {
	    name: "contains",
	    valueType: "single"
	  },
	  "bt": {
	    name: "between",
	    valueType: "array2"
	  },
	  "nbt": {
	    name: "outside",
	    valueType: "array2"
	  }
	};

	/**
	 * Types
	 * @property Types
	 */
	Backgrid.Extension.AdvancedFilter.FilterOptions.Types = {
	  "string": {
	    parser: function(value) {
	      return value;
	    },
	    validator: function(value) {
	      return _.isString(value);
	    },
	    postProcessor: function(value) {
	      return value.trim();
	    },
	    matchers: ["sw", "ew", "eq", "neq", "ct"],
	    inputType: "textbox"
	  },
	  "number": {
	    parser: function(value) {
	      return parseFloat(value);
	    },
	    validator: function(value) {
	      return !isNaN(value);
	    },
	    postProcessor: function(value) {
	      return value;
	    },
	    matchers: ["gt", "gte", "lt", "lte", "bt", "nbt", "eq", "neq"],
	    inputType: "textbox"
	  },
	  "integer": {
	    parser: function(value) {
	      return parseInt(value);
	    },
	    validator: function(value) {
	      return !isNaN(value);
	    },
	    postProcessor: function(value) {
	      return value;
	    },
	    matchers: ["gt", "gte", "lt", "lte", "bt", "nbt", "eq", "neq"],
	    inputType: "textbox"
	  },
	  "percent": {
	    parser: function(value) {
	      return parseFloat(value);
	    },
	    validator: function(value) {
	      return !isNaN(value) && value >= 0 && value <= 100;
	    },
	    postProcessor: function(value) {
	      return value / 100;
	    },
	    matchers: ["gt", "gte", "lt", "lte", "bt", "nbt", "eq", "neq"],
	    inputType: "textbox"
	  },
	  "boolean": {
	    parser: function(value) {
	      return !!value;
	    },
	    validator: function(value) {
	      return _.isBoolean(value);
	    },
	    postProcessor: function(value) {
	      return value;
	    },
	    matchers: ["eq", "neq"],
	    inputType: "boolean-select"
	  }
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * Filter collection definition
	 *
	 * @module AdvancedFilter.FilterParsers
	 */
	var _ = __webpack_require__(2);
	var Backgrid = __webpack_require__(5);
	Backgrid.Extension.AdvancedFilter.FilterParsers = {};

	/**
	 * @class MongoParser
	 * @constructor
	 */
	var MongoParser = Backgrid.Extension.AdvancedFilter.FilterParsers.MongoParser = function() {};

	/**
	 * @method parse
	 * @return {Object}
	 */
	MongoParser.prototype.parse = function(filter) {
	  var self = this;

	  // Input argument checking
	  if (!filter ||
	    !filter instanceof Backgrid.Extension.AdvancedFilter.FilterModel) {
	    throw new Error("MongoParser: No (valid) filter collection provided");
	  }

	  // Get array of valid filters
	  var validAttributeFilters = self.getValidOnly(filter);

	  // Parse filters
	  var result = [];
	  _.each(validAttributeFilters, function(attrFilter) {
	    result.push(self.parseAttributeFilter(attrFilter.toJSON()));
	  });

	  return {
	    "$and": result
	  };
	};

	/**
	 * @method getValidOnly
	 * @param {Backgrid.Extension.AdvancedFilter.FilterModel} filter
	 * @return {Array} valid attribute filter models
	 * @private
	 */
	MongoParser.prototype.getValidOnly = function(filter) {
	  // Get attribute filters
	  var attributeFilters = filter.get("attributeFilters");

	  // Return array of valid filters
	  return attributeFilters.where({valid: true});
	};

	/**
	 * @method parseAttributeFilter
	 * @param {Object} attributeFilter
	 * @return {Object} mongo style filter
	 * @private
	 */
	MongoParser.prototype.parseAttributeFilter = function(attributeFilter) {
	  var result = {};
	  switch(attributeFilter.matcher) {
	    // String only
	    case "sw":
	      // Starts with
	      result[attributeFilter.column] = {
	        "$regex": "^" + attributeFilter.value
	      };
	      break;
	    case "ew":
	      // Ends with
	      result[attributeFilter.column] = {
	        "$regex": attributeFilter.value + "$"
	      };
	      break;
	    case "ct":
	      // Contains
	      result[attributeFilter.column] = {
	        "$regex": attributeFilter.value
	      };
	      break;

	    // Numerical
	    case "gt":
	      // Greater than
	      result[attributeFilter.column] = {
	        "$gt": attributeFilter.value
	      };
	      break;
	    case "gte":
	      // Greater than or equal
	      result[attributeFilter.column] = {
	        "$gte": attributeFilter.value
	      };
	      break;
	    case "lt":
	      // Lower than
	      result[attributeFilter.column] = {
	        "$lt": attributeFilter.value
	      };
	      break;
	    case "lte":
	      // Lower than or equal
	      result[attributeFilter.column] = {
	        "$lte": attributeFilter.value
	      };
	      break;
	    case "bt":
	      // Between (value1 <= x <= value2)
	      var firstVal = {};
	      var secondVal = {};

	      firstVal[attributeFilter.column] = {
	        "$gte": attributeFilter.value[0]
	      };

	      secondVal[attributeFilter.column] = {
	        "$lte": attributeFilter.value[1]
	      };

	      result = {
	        "$and": [
	          firstVal, secondVal
	        ]
	      };
	      break;

	    case "nbt":
	      // Outside (x < value1 OR x > value2)
	      var firstValnbt = {};
	      var secondValnbt = {};

	      firstValnbt[attributeFilter.column] = {
	        "$lt": attributeFilter.value[0]
	      };

	      secondValnbt[attributeFilter.column] = {
	        "$gt": attributeFilter.value[1]
	      };

	      result = {
	        "$and": [
	          firstValnbt, secondValnbt
	        ]
	      };
	      break;

	    // General
	    case "eq":
	      // Equals
	      result[attributeFilter.column] = {
	        "$eq": attributeFilter.value
	      };
	      break;
	    case "neq":
	      // Does not equal
	      result[attributeFilter.column] = {
	        "$neq": attributeFilter.value
	      };
	      break;
	  }
	  return result;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * Filter state model definition
	 *
	 * @module AdvancedFilter.FilterStateModel
	 */
	var _ = __webpack_require__(2);
	var Backbone = __webpack_require__(4);
	var Backgrid = __webpack_require__(5);
	var FilterTypes = Backgrid.Extension.AdvancedFilter.FilterOptions.Types;
	var FilterMatchers = Backgrid.Extension.AdvancedFilter.FilterOptions.Matchers;

	/**
	 *
	 * @class FilterStateModel
	 * @extends Backbone.Model
	 */
	Backgrid.Extension.AdvancedFilter.FilterStateModel = Backbone.Model.extend({
	  defaults: {
	    activeFilterId: null,
	    columnCollection: null,
	    dataCollection: null,
	    filterCollection: null
	  },

	  /**
	   * @method getActiveFilter
	   * @return {Backgrid.Extension.AdvancedFilter.FilterModel}
	   */
	  getActiveFilter: function() {
	    var self = this;
	    var filterId = self.get("activeFilterId");
	    return self.get("filterCollection").get(filterId);
	  },

	  /**
	   * @method setActiveFilter
	   * @param filterToActivate
	   */
	  setActiveFilter: function(filterToActivate) {
	    var self = this;

	    // Remove saved state from current filter
	    self.trigger("filter:save");

	    var filterId;
	    if (filterToActivate instanceof Backgrid.Extension.AdvancedFilter.FilterModel) {
	      filterId = filterToActivate.cid;
	    }
	    else {
	      filterId = filterToActivate;
	    }

	    if (self.get("filterCollection").get(filterId)) {
	      self.set("activeFilterId", filterId);
	    }
	  },

	  /**
	   * @method getFilterableColumns
	   */
	  getFilterableColumns: function() {
	    var self = this;
	    var columns = self.get("columnCollection");
	    if (!columns) {
	      return {};
	    }

	    var filterAbleColumns = columns.filter(function(col) {
	      return _.has(FilterTypes, col.get("filterType"));
	    });

	    var result = {};
	    _.each(filterAbleColumns, function(col) {
	      result[col.get("name")] = {
	        label: col.get("label"),
	        filterType: col.get("filterType")
	      };
	    });

	    return result;
	  },

	  /**
	   * @method getMatchers
	   * @param {String} type
	   */
	  getMatchers: function(type) {
	    var filterType = FilterTypes[type];

	    if (!filterType) {
	      return {};
	    }

	    var result = {};
	    _.each(filterType.matchers, function(matcher) {
	      result[matcher] = {
	        label: FilterMatchers[matcher].name
	      };
	    });

	    return result;
	  },

	  /**
	   * @method getInputTypeInfoForMatcher
	   * @param matcher
	   * @return {string}
	   */
	  getInputTypeInfoForMatcher: function(matcher, filterType) {
	    return {
	      valueType: FilterMatchers[matcher].valueType,
	      inputType: FilterTypes[filterType].inputType
	    };
	  },

	  /**
	   * @method getValueParser
	   * @param filterType
	   * @return {Function}
	   */
	  getValueParser: function(filterType) {
	    return FilterTypes[filterType].parser;
	  }
	});


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * Filter collection definition
	 *
	 * @module AdvancedFilter.FilterCollection
	 */
	var Backbone = __webpack_require__(4);
	var Backgrid = __webpack_require__(5);
	var _ = __webpack_require__(2);
	var Matchers = Backgrid.Extension.AdvancedFilter.FilterOptions.Matchers;
	var FilterTypes = Backgrid.Extension.AdvancedFilter.FilterOptions.Types;
	var MatchersValueTypeValidator = Backgrid.Extension.AdvancedFilter.FilterOptions.MatchersValueTypeValidator;

	/**
	 *
	 * @class AdvancedFilter.AttributeFilterModel
	 * @extends Backbone.Model
	 */
	var attributeFilterModel = Backgrid.Extension.AdvancedFilter.AttributeFilterModel = Backbone.Model.extend({
	  defaults: {
	    column: null,
	    type: null,
	    matcher: "eq",
	    value: null,
	    valid: false
	  },

	  initialize: function() {
	    var self = this;

	    // Events
	    self.listenTo(self, "change:column change:type change:matcher change:value", self.setValidity);
	    self.listenTo(self, "change:column", self.columnChange);
	    self.listenTo(self, "change:matcher", self.matcherChange);
	  },

	  /**
	   * @method validator
	   * @return {boolean}
	   */
	  validator: function() {
	    var self = this;
	    var valid = false;

	    // Check if type exists
	    var type = self.get("type");
	    var matcher = self.get("matcher");
	    var value = self.get("value");
	    if (_.has(FilterTypes, type)) {

	      // Check if matcher belongs to type
	      if (_.contains(FilterTypes[type].matchers, matcher)) {

	        // Check if the type of value is valid for current matcher
	        var matcherValueType = Matchers[matcher].valueType;
	        if (MatchersValueTypeValidator[matcherValueType](value)) {
	          // Validate the value
	          if (_.isArray(value)) {
	            var allValid = true;
	            _.each(value, function(val) {
	              allValid = allValid && FilterTypes[type].validator(val);
	            });
	            valid = allValid;
	          }
	          else {
	            valid = FilterTypes[type].validator(value);
	          }
	        }
	      }
	    }
	    return valid;
	  },

	  /**
	   * @method setValidity
	   */
	  setValidity: function() {
	    var self = this;

	    self.set("valid", self.validator());
	  },

	  /**
	   * @method columnChange
	   */
	  columnChange: function() {
	    var self = this;
	    if(!self.validator()) {
	      self.set("matcher", null);
	    }
	  },

	  /**
	   * @method matcherChange
	   */
	  matcherChange: function() {
	    var self = this;
	    if(!self.validator()) {
	      self.set("value", null);
	    }
	  }
	});

	/**
	 *
	 * @class AdvancedFilter.AttributeFilterCollection
	 * @extends Backbone.Collection
	 */
	Backgrid.Extension.AdvancedFilter.AttributeFilterCollection = Backbone.Collection.extend({
	  model: attributeFilterModel,

	  /**
	   * @method createNewFilter
	   */
	  createNewAttributeFilter: function() {
	    var self = this;

	    self.add({});
	  }
	});

	/**
	 *
	 * @class AdvancedFilter.FilterModel
	 * @extends Backbone.Model
	 */
	var FilterModel = Backgrid.Extension.AdvancedFilter.FilterModel = Backbone.Model.extend({
	  defaults: {
	    name: null,
	    attributeFilters: null
	  },
	  lastSavedState: null,
	  filterChanged: false,

	  /**
	   * @method initialize
	   */
	  initialize: function () {
	    var self = this;

	    // Save the initial state so we can cancel changes later.
	    self.saveState();

	    // Update events
	    self.listenTo(self.get("attributeFilters"), "change add remove", self.evtFilterChanged);
	    self.listenTo(self, "change:name", self.evtFilterChanged);
	  },

	  /**
	   * @method evtFilterChanged
	   */
	  evtFilterChanged: function () {
	    var self = this;
	    self.filterChanged = true;

	    self.trigger("filter:changed");
	  },

	  /**
	   * @method saveFilter
	   */
	  saveFilter: function () {
	    var self = this;
	    self.saveState();
	  },

	  /**
	   * @method resetFilter
	   */
	  resetFilter: function () {
	    var self = this;
	    self.get("attributeFilters").reset([]);
	  },

	  /**
	   * @method cancelFilter
	   */
	  cancelFilter: function () {
	    var self = this;
	    self.loadSavedState();
	  },

	  /**
	   * @method saveState
	   * @private
	   */
	  saveState: function () {
	    var self = this;

	    var name = self.get("name");
	    var attributeFilters = self.get("attributeFilters");

	    if (attributeFilters && attributeFilters.length > 0) {
	      attributeFilters = attributeFilters.toJSON();
	    }
	    else {
	      attributeFilters = null;
	    }

	    self.lastSavedState = {
	      name: name,
	      attributeFilters: attributeFilters
	    };

	    self.filterChanged = false;
	  },

	  /**
	   * @method loadSavedState
	   * @private
	   */
	  loadSavedState: function () {
	    var self = this;
	    if (self.lastSavedState) {
	      self.set("name", self.lastSavedState.name);
	      self.get("attributeFilters").reset(self.lastSavedState.attributeFilters);
	    }
	  },

	  /**
	   * @method removeSavedState
	   */
	  removeSavedState: function () {
	    var self = this;
	    self.lastSavedState = null;
	  },

	  /**
	   * Set override
	   * Makes sure the attributeFilters are set as a collection.
	   *
	   * @method set
	   * @param {Object} attributes
	   * @param {Object} options
	   * @return {*}
	   */
	  set: function (attributes, options) {
	    var AttrCollection = Backgrid.Extension.AdvancedFilter.AttributeFilterCollection;
	    if (attributes.attributeFilters !== undefined && !(attributes.attributeFilters instanceof AttrCollection)) {
	      attributes.attributeFilters = new AttrCollection(attributes.attributeFilters);
	    }
	    return Backbone.Model.prototype.set.call(this, attributes, options);
	  },

	  /**
	   * Export the filter for a given style
	   * @method exportFilter
	   * @param {String} style. Values: "(mongo|mongodb), ..."
	   * @param {boolean} exportAsString exports as a string if true.
	   * @return {Object}
	   */
	  exportFilter: function (style, exportAsString) {
	    var self = this;

	    var result;
	    switch (style) {
	      case "mongo":
	      case "mongodb":
	      default:
	        var mongoParser = new Backgrid.Extension.AdvancedFilter.FilterParsers.MongoParser();
	        result = mongoParser.parse(self);

	        if (exportAsString) {
	          result = self.stringifyFilterJson(result);
	        }
	    }
	    return result;
	  },

	  /**
	   * @method stringifyFilterJson
	   * @param {Object} filterObj
	   * @param {String} style. Values: "(mongo|mongodb), ..."
	   */
	  stringifyFilterJson: function(filterObj, style) {
	    var result;
	    switch (style) {
	      case "mongo":
	      case "mongodb":
	      default:
	        result = JSON.stringify(filterObj);
	    }
	    return result;
	  }
	});

	/**
	 *
	 * @class AdvancedFilter.FilterCollection
	 * @extends Backbone.Collection
	 */
	Backgrid.Extension.AdvancedFilter.FilterCollection = Backbone.Collection.extend({
	  /**
	   * Partial in newFilterName which is replaced by a number.
	   * @property filterNamePartial
	   */
	  filterNamePartial: "{count}",

	  /**
	   *  Template for new filter names. Beware: partial should be located at the end!
	   *  @property newFilterName
	   */
	  newFilterName: "New Filter #{count}",
	  newFilterCount: 0,
	  model: FilterModel,

	  /**
	   * @method createNewFilter
	   * @return {Backbone.Model} newFilter
	   */
	  createNewFilter: function() {
	    var self = this;

	    var newFilter = new FilterModel({
	      name: self.getNewFilterName(self.getNewFilterNumber())
	    });

	    // Add to the collection
	    self.add(newFilter);

	    // Return the filter
	    return newFilter;
	  },

	  /**
	   * Retrieves a new filter number.
	   * @method getNewFilterNumber
	   * @return {int}
	   * @private
	   */
	  getNewFilterNumber: function() {
	    var self = this;
	    self.newFilterCount += 1;

	    if (self.length === 0) {
	      return self.newFilterCount;
	    }
	    else {
	      var newFilterName = self.newFilterName.replace(self.filterNamePartial, "");
	      var results = self.filter(function(fm) {
	        return fm.get("name").indexOf(newFilterName) === 0;
	      }).map(function(fm) {
	        return fm.get("name");
	      });

	      if (_.isArray(results) && results.length > 0) {
	        // Sort results
	        results.sort();

	        // Get highest count
	        var highestCount = parseInt(results[results.length - 1].replace(newFilterName, ""));
	        if (_.isNaN(highestCount)) {
	          highestCount = self.newFilterCount;
	        }
	        else {
	          highestCount += 1;
	        }
	      }
	      else {
	        highestCount = self.newFilterCount;
	      }

	      return highestCount;
	    }
	  },

	  /**
	   *
	   * @method getNewFilterName
	   * @param {int} count
	   * @return {string}
	   * @private
	   */
	  getNewFilterName: function(count) {
	    return this.newFilterName.replace(this.filterNamePartial, count);
	  }
	});


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * A column manager for backgrid
	 *
	 * @module AdvancedFilter.Saver
	 */
	var _ = __webpack_require__(2);
	var Backbone = __webpack_require__(4);
	var Backgrid = __webpack_require__(5);

	/**
	 *
	 * @class AdvancedFilter.Saver
	 * @extends Backbone.View
	 */
	Backgrid.Extension.AdvancedFilter.Saver = Backbone.View.extend({
	  className: "advancedfilter-saver",
	  tagName: "div",
	  template: _.template("" +
	    "<div class=\"advancedfilter-saver-input\">" +
	      "<input type=\"text\" value=\"<%-inputValue%>\">" +
	    "</div>" +
	    "<div class=\"advancedfilter-saver-buttons\">" +
	      "<button class=\"remove\"><%-removeText%></button>" +
	      "<button class=\"reset\"><%-resetText%></button>" +
	      "<button class=\"cancel\"><%-cancelText%></button>" +
	      "<button class=\"save\"><%-saveText%></button>" +
	    "</div>" +
	    "<div class=\"clearer\"></div>"
	  ),
	  events: {
	    "click button.reset": "resetFilter",
	    "click button.cancel": "cancelFilter",
	    "click button.save": "saveFilter",
	    "click button.remove": "removeFilter"
	  },

	  defaults: {
	    resetText: "Reset",
	    cancelText: "Cancel",
	    saveText: "Save",
	    removeText: "Remove"
	  },

	  /**
	   * @method initialize
	   * @param options
	   */
	  initialize: function (options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Input argument checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;

	    // Events
	    self.listenTo(self.filterStateModel, "add remove change:activeFilterId", self.render);
	  },

	  /**
	   * @method render
	   * @return {AdvancedFilter.Saver}
	   */
	  render: function() {
	    var self = this;
	    self.$el.empty();

	    if (self.filterStateModel.get("activeFilterId") !== null) {
	      var inputValue = self.filterStateModel.get("filterCollection")
	        .get(self.filterStateModel.get("activeFilterId")).get("name");

	      // Render template
	      self.$el.html(self.template({
	        inputValue: inputValue,
	        resetText: self.options.resetText,
	        cancelText: self.options.cancelText,
	        saveText: self.options.saveText,
	        removeText: self.options.removeText
	      }));
	    }

	    return self;
	  },

	  /**
	   * @method saveFilter
	   * @param {Event} e
	   */
	  saveFilter: function(e) {
	    var self = this;
	    self.stopEvent(e);

	    // Get input value
	    var inputFilterName = self.$el.find("input").val();

	    // Get current filter
	    var filter = self.filterStateModel.get("filterCollection")
	      .get(self.filterStateModel.get("activeFilterId"));

	    // Update filter name
	    if (inputFilterName !== "") {
	      filter.set("name", inputFilterName);
	    }
	    else {
	      self.$el.find("input").val(filter.get("name"));
	    }

	    self.filterStateModel.trigger("filter:save");
	  },

	  /**
	   * @method resetFilter
	   * @param {Event} e
	   */
	  resetFilter: function(e) {
	    var self = this;
	    self.stopEvent(e);

	    self.filterStateModel.trigger("filter:reset");
	  },

	  /**
	   * @method cancelFilter
	   * @param {Event} e
	   */
	  cancelFilter: function(e) {
	    var self = this;
	    self.stopEvent(e);

	    // Get current filter
	    var filter = self.filterStateModel.getActiveFilter();

	    // Reset filter name to actual current value
	    self.$el.find("input").val(filter.get("name"));

	    self.filterStateModel.trigger("filter:cancel");
	  },

	  /**
	   * @method removeFilter
	   * @param {Event} e
	   */
	  removeFilter: function(e) {
	    var self = this;
	    self.stopEvent(e);

	    self.filterStateModel.trigger("filter:remove");
	  },

	  /**
	   * @method stopEvent
	   * @param {Event} e
	   */
	  stopEvent: function(e) {
	    e.stopPropagation();
	    e.preventDefault();
	  }
	});


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Dropdown subcomponent
	 *
	 * @module AdvancedFilter.Subcomponents
	 */

	// Dependencies
	var _ = __webpack_require__(2);
	var Backbone = __webpack_require__(4);
	var Backgrid = __webpack_require__(5);

	/**
	 * A dropdown item view
	 *
	 * @class AdvancedFilter.Subcomponents.FilterDropdownItemview
	 * @extends Backbone.View
	 */
	Backgrid.Extension.AdvancedFilter.SubComponents.FilterDropdownItemview = Backbone.View.extend({
	  className: "advancedfilter-dropdown-item",
	  template: _.template("<span class='indicator'></span><span class='filter-name'><%= name %></span>"),
	  tagName: "li",
	  events: {
	    "click": "setActiveFilter"
	  },

	  /**
	   * @method initialize
	   * @param {object} opts
	   * @param {Backgrid.Extension.ColumnManager} opts.columnManager ColumnManager instance.
	   * @param {Backgrid.Column} opts.column A backgrid column.
	   */
	  initialize: function (opts) {
	    var self = this;

	    self.filterStateModel = opts.parentView.filterStateModel;
	    self.filter = opts.filter;

	    _.bindAll(self, "render", "setActiveFilter");
	    self.listenTo(self.filter, "change:name", self.render, self);
	  },

	  /**
	   * Activates current filer
	   *
	   * @method setActiveFilter
	   * @param {object} e
	   */
	  setActiveFilter: function (e) {
	    var self = this;
	    if (e) {
	      self.stopPropagation(e);
	    }

	    self.filterStateModel.setActiveFilter(self.filter);
	  },

	  /**
	   * @method render
	   * @return {DropDownItemView}
	   */
	  render: function () {
	    var self = this;

	    self.$el.empty();

	    self.$el.append(self.template({
	      name: self.filter.get("name")
	    }));

	    if (self.filterStateModel.get("activeFilterId") === self.filter.cid) {
	      self.$el.addClass("active");
	    }
	    else {
	      self.$el.removeClass("active");
	    }

	    return self;
	  },

	  /**
	   * Convenience function to stop event propagation.
	   *
	   * @method stopPropagation
	   * @param {object} e
	   * @private
	   */
	  stopPropagation: function (e) {
	    e.stopPropagation();
	    e.stopImmediatePropagation();
	    e.preventDefault();
	  }
	});

	/**
	 * Filter dropdown view container.
	 *
	 * @class AdvancedFilter.Subcomponents.FilterDropdownContainer
	 * @extends Backbone.view
	 */
	Backgrid.Extension.AdvancedFilter.SubComponents.FilterDropdownContainer = Backbone.View.extend({
	  className: "filter-dropdown-container",
	  defaults: {
	    DropdownItemView: Backgrid.Extension.AdvancedFilter.SubComponents.FilterDropdownItemview
	  },

	  initialize: function (options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Input argument checking
	    self.parentView = self.options.parentView;

	    // Bind events
	    self.listenTo(self.parentView.filterStateModel.get("filterCollection"), "add remove", self.render);
	    self.listenTo(self.parentView.filterStateModel, "change:activeFilterId", self.render);
	  },

	  /**
	   * @method render
	   * @return {DropDownView}
	   */
	  render: function () {
	    var self = this;
	    self.$el.empty();

	    // List all filters
	    self.parentView.filterStateModel.get("filterCollection").each(function (filter) {
	      self.$el.append(new self.options.DropdownItemView({
	        filter: filter,
	        parentView: self.parentView
	      }).render().$el);
	    });

	    return self;
	  },

	  /**
	   * Opens the dropdown.
	   *
	   * @method open
	   */
	  open: function () {
	    var self = this;

	    self.$el.addClass("open");

	    // Get button
	    var $button = self.parentView.$dropdownButton;

	    // Align
	    var align;
	    if (self.options.align === "auto") {
	      // Determine what alignment fits
	      var viewPortWidth = document.body.clientWidth || document.body.clientWidth;
	      align = (($button.offset().left + self.$el.outerWidth()) > viewPortWidth) ? "left" : "right";
	    }
	    else {
	      align = (self.options.align === "left" || self.options.align === "right") ?
	        (self.options.align === "right" ? "right" : "left") : "right";
	    }

	    var offset;
	    if (align === "left") {
	      // Align right by default
	      offset = $button.offset().left + $button.outerWidth() - self.$el.outerWidth();
	      self.$el.css("left", offset + "px");
	    }
	    else {
	      offset = $button.offset().left;
	      self.$el.css("left", offset + "px");
	    }

	    // Height position
	    var offsetHeight = $button.offset().top + $button.outerHeight();
	    self.$el.css("top", offsetHeight + "px");
	  },

	  /**
	   * Closes the dropdown.
	   *
	   * @method close
	   */
	  close: function () {
	    this.$el.removeClass("open");
	  }
	});

	/**
	 * @class AdvancedFilter.Subcomponents.FilterDropdown
	 * @extends Backbone.View
	 */
	Backgrid.Extension.AdvancedFilter.SubComponents.FilterDropdown = Backbone.View.extend({
	  tagName: "div",
	  defaultEvents: {
	    "click": "stopPropagation"
	  },
	  defaults: {
	    width: null,
	    closeOnEsc: true,
	    closeOnClick: true,
	    openOnInit: false,

	    // Button
	    buttonTemplate: _.template("<button class='dropdown-button <%-buttonClass%>'><%=buttonText%></button>"),
	    buttonClass: "",
	    buttonText: "Filter &#9660;",

	    // Container
	    DropdownView: Backgrid.Extension.AdvancedFilter.SubComponents.FilterDropdownContainer,
	    dropdownAlign: "auto"
	  },

	  /**
	   * @method initialize
	   * @param {Object} opts
	   * @param {Backgrid.Extension.AdvancedFilter.FilterStateModel} opts.filterStateModel
	   */
	  initialize: function (opts) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, opts || {});
	    self.events = _.extend({}, self.defaultEvents, self.events || {});

	    // Option checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;

	    // Bind scope to events
	    _.bindAll(self, "deferClose", "stopDeferClose", "closeOnEsc", "toggle", "render", "open", "close");

	    // UI events
	    document.body.addEventListener("click", self.deferClose, true);
	    if (self.options.closeOnEsc) {
	      document.body.addEventListener("keyup", self.closeOnEsc, false);
	    }
	    self.$el.on("click", self.stopDeferClose);

	    // Create elements
	    self.setup();

	    // Listen for dropdown view events indicating to open and/or close
	    self.listenTo(self.filterStateModel.get("filterCollection"), "add remove", self.checkDisabled);
	  },

	  /**
	   * @method delayStart
	   * @private
	   */
	  delayStart: function () {
	    clearTimeout(this.closeTimeout);
	    this.delayTimeout = setTimeout(this.open, this.options.delay);
	  },

	  /**
	   * @method delayEnd
	   * @private
	   */
	  delayEnd: function () {
	    clearTimeout(this.delayTimeout);
	    this.closeTimeout = setTimeout(this.close, 300);
	  },

	  /**
	   * @method setup
	   * @private
	   */
	  setup: function () {
	    var self = this;

	    // Override element width
	    if (self.options.width) {
	      self.$el.width(self.options.width + "px");
	    }

	    // Create button element
	    self.$dropdownButton = Backbone.$(self.options.buttonTemplate({
	      buttonClass: self.options.buttonClass,
	      buttonText: self.options.buttonText
	    })).click(self.toggle);

	    // Create dropdown container
	    self.dropdownContainerView = new self.options.DropdownView({
	      filterStateModel: self.filterStateModel,
	      align: self.options.dropdownAlign,
	      parentView: self
	    }).render();

	    // Render inner view
	    document.body.appendChild(self.dropdownContainerView.el);
	  },

	  /**
	   * @method setup
	   */
	  render: function () {
	    var self = this;
	    self.$el.empty();

	    // Render button
	    self.$el.html(self.$dropdownButton);

	    // Verify disabled mode
	    self.checkDisabled();

	    return self;
	  },

	  /**
	   * @method checkDisabled
	   */
	  checkDisabled: function() {
	    var self = this;
	    if (self.filterStateModel.get("filterCollection").length > 0) {
	      self.$dropdownButton.removeAttr("disabled");
	    }
	    else {
	      self.$dropdownButton.attr("disabled", "disabled");
	    }
	  },

	  /**
	   * Convenience function to stop event propagation
	   *
	   * @method stopPropagation
	   * @param {object} e
	   * @private
	   */
	  stopPropagation: function (e) {
	    e.stopPropagation();
	    e.stopImmediatePropagation();
	    e.preventDefault();
	  },

	  /**
	   * Toggle the dropdown visibility
	   *
	   * @method toggle
	   * @param {object} [e]
	   */
	  toggle: function (e) {
	    var self = this;
	    if (self.isOpen !== true) {
	      self.open(e);
	    }
	    else {
	      self.close(e);
	    }
	  },

	  /**
	   * Open the dropdown
	   *
	   * @method open
	   * @param {object} [e]
	   */
	  open: function (e) {
	    var self = this;

	    clearTimeout(self.closeTimeout);
	    clearTimeout(self.deferCloseTimeout);

	    if (e) {
	      if (e.stopPropagation) {
	        e.stopPropagation();
	      }
	      if (e.preventDefault) {
	        e.preventDefault();
	      }
	      e.cancelBubble = true;
	    }

	    // Don't do anything if already open
	    if (self.isOpen) {
	      return;
	    }

	    self.isOpen = true;
	    self.$el.addClass("open");

	    // Notify child view
	    self.dropdownContainerView.open();
	  },

	  /**
	   * Close the dropdown
	   *
	   * @method close
	   * @param {object} [e]
	   */
	  close: function (e) {
	    var self = this;

	    // Don't do anything if already closed
	    if (!self.isOpen) {
	      return;
	    }

	    self.isOpen = false;
	    self.$el.removeClass("open");

	    // Notify child view
	    self.dropdownContainerView.close();
	  },

	  /**
	   * Close the dropdown on esc
	   *
	   * @method closeOnEsc
	   * @param {object} e
	   * @private
	   */
	  closeOnEsc: function (e) {
	    if (e.which === 27) {
	      this.deferClose();
	    }
	  },

	  /**
	   * @method deferClose
	   * @private
	   */
	  deferClose: function () {
	    this.deferCloseTimeout = setTimeout(this.close, 0);
	  },

	  /**
	   * @method stopDeferClose
	   * @private
	   */
	  stopDeferClose: function (e) {
	    clearTimeout(this.deferCloseTimeout);
	  },

	  /**
	   * Clean up this control
	   *
	   * @method remove
	   * @chainable
	   */
	  remove: function () {
	    var self = this;

	    // Remove child
	    self.dropdownContainerView.remove();

	    // Remove event listeners
	    document.body.removeEventListener("click", self.deferClose);
	    if (self.options.closeOnEsc) {
	      document.body.removeEventListener("keyup", self.closeOnEsc);
	    }
	    self.$el.off("click", self.stopDeferClose);
	    self.$dropdownButton.off("click", self.toggle);

	    // Invoke original backbone methods
	    return Backbone.View.prototype.remove.apply(self, arguments);
	  }
	});


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * A column manager for backgrid
	 *
	 * @module AdvancedFilter.Selector
	 */

	// Dependencies
	var _ = __webpack_require__(2);
	var Backbone = __webpack_require__(4);
	var Backgrid = __webpack_require__(5);
	__webpack_require__(13);

	// Label component
	/**
	 * @class AdvancedFilter.SubComponents.LabelView
	 * @extends Backbone.View
	 */
	Backgrid.Extension.AdvancedFilter.SubComponents.LabelView = Backbone.View.extend({
	  tagName: "span",
	  templates: {
	    noFilterSelected: _.template("create"),
	    filterSelected: _.template("<span class=\"remove\"><%-filterName%></span><span class=\"remove-filter\">x</span>")
	  },
	  events: {
	    "click": "labelClick",
	    "click .remove-filter": "removeClick"
	  },

	  /**
	   * @property defaults
	   */
	  defaults: {
	    labelClass: ""
	  },

	  /**
	   * @method initialize
	   * @param options
	   */
	  initialize: function(options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Input argument checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;

	    // Add class
	    self.$el.addClass(self.options.labelClass);

	    // Event handlers
	    self.listenTo(self.filterStateModel, "change:activeFilterId", self.render);
	    self.listenTo(self.filterStateModel.get("filterCollection"), "change:name", self.render);
	  },

	  /**
	   * @method render
	   * @return {Backgrid.Extension.AdvancedFilter.SubComponents.LabelView}
	   * @chainable
	   */
	  render: function() {
	    var self = this;
	    self.$el.empty();

	    // Render template
	    if (self.filterStateModel.get("activeFilterId") !== null) {
	      self.$el.removeClass("create");

	      // Get filter model
	      var filterModel = self.filterStateModel.getActiveFilter();

	      // Render
	      self.$el.html(self.templates.filterSelected({
	        filterName: filterModel.get("name")
	      }));
	    }
	    else {
	      self.$el.html(self.templates.noFilterSelected());
	      self.$el.addClass("create");
	    }

	    return self;
	  },

	  /**
	   * @method labelClick
	   * @param {Event} e
	   */
	  labelClick: function(e) {
	    var self = this;
	    self.stopEvent(e);
	    if (self.filterStateModel.get("activeFilterId") === null) {
	      self.filterStateModel.trigger("filter:new");
	    }
	  },

	  /**
	   * @method removeClick
	   * @param {Event} e
	   */
	  removeClick: function(e) {
	    var self = this;
	    self.stopEvent(e);
	    if (self.filterStateModel.get("activeFilterId")) {
	      self.filterStateModel.trigger("filter:save");
	      self.filterStateModel.set("activeFilterId", null);
	    }
	  },

	  /**
	   * @method stopEvent
	   * @param {Event} e
	   */
	  stopEvent: function(e) {
	    e.stopPropagation();
	    e.preventDefault();
	  }
	});

	/**
	 * Main selector component. Consists of a filter selector, searchbar and 'new filter' button.
	 *
	 * @class AdvancedFilter.Selector
	 * @extends Backbone.View
	 */
	Backgrid.Extension.AdvancedFilter.Selector = Backbone.View.extend({
	  className: "advancedfilter-selector",
	  tagName: "div",
	  template: _.template("" +
	      "<div class=\"filter-dropdown\"></div>" +
	      "<div class=\"filter-label\"></div>" +
	      "<div class=\"filter-search\"></div>" +
	    ""),

	  /**
	   * @property defaults
	   */
	  defaults: {
	    FilterDropdownComponent: Backgrid.Extension.AdvancedFilter.SubComponents.FilterDropdown,
	    LabelComponent: Backgrid.Extension.AdvancedFilter.SubComponents.LabelView,
	    SearchComponent: Backgrid.Extension.ClientSideFilter
	  },

	  /**
	   * @method initialize
	   * @param options
	   */
	  initialize: function (options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});

	    // Components object
	    self.components = {};

	    // Input argument checking
	    if (!self.options.filterStateModel ||
	      !self.options.filterStateModel instanceof Backbone.Model) {
	      throw new Error("No (valid) filter state model provided");
	    }
	    self.filterStateModel = self.options.filterStateModel;
	  },

	  /**
	   * @method render
	   * @return {AdvancedFilter.Selector}
	   */
	  render: function() {
	    var self = this;
	    self.$el.empty();

	    // Render template
	    self.$el.html(self.template());

	    // Cache ui components
	    self.ui = {};
	    self.ui.$dropdown = self.$el.find(".filter-dropdown").first();
	    self.ui.$label = self.$el.find(".filter-label").first();
	    self.ui.$search = self.$el.find(".filter-search").first();

	    // Add filter dropdown
	    var filterDropdown = self.getFilterDropdownComponent();
	    self.ui.$dropdown.append(filterDropdown.render().$el);

	    // Add filter label
	    var labelComponent = self.getLabelComponent();
	    self.ui.$label.append(labelComponent.render().$el);

	    // Add search bar
	    var searchComponent = self.getSearchComponent();
	    self.ui.$search.append(searchComponent.render().$el);

	    return this;
	  },

	  /**
	   * @method getFilterDropdownComponent
	   * @return {Backbone.View}
	   */
	  getFilterDropdownComponent: function() {
	    var self = this;
	    self.components.filterDropdown = new this.options.FilterDropdownComponent({
	      filterStateModel: self.filterStateModel
	    });

	    return self.components.filterDropdown;
	  },

	  /**
	   * @method getLabelComponent
	   * @return {Backbone.View}
	   */
	  getLabelComponent: function() {
	    var self = this;
	    self.components.label = new this.options.LabelComponent({
	      filterStateModel: self.filterStateModel
	    });

	    return self.components.label;
	  },

	  /**
	   * @method getSearchComponent
	   * @return {Backbone.View}
	   */
	  getSearchComponent: function() {
	    var self = this;
	    self.components.search = new this.options.SearchComponent({
	      collection: self.filterStateModel.get("dataCollection"),
	      placeholder: self.options.searchPlaceHolder || "",
	      // The model fields to search for matches
	      fields: self.options.textSearchFields,
	      // How long to wait after typing has stopped before searching can start
	      wait: 150
	    });

	    return self.components.search;
	  }
	});


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	  backgrid-filter
	  http://github.com/wyuenho/backgrid

	  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
	  Licensed under the MIT @license.
	*/
	(function (root, factory) {

	  if (true) {
	    // AMD. Register as an anonymous module.
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(4), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports == "object") {
	    // CommonJS
	    (function () {
	      var lunr;
	      try { lunr = require("lunr"); } catch (e) {}
	      module.exports = factory(require("underscore"),
	                               require("backbone"),
	                               require("backgrid"),
	                               lunr);
	    }());
	  } else {
	    // Browser
	    factory(root._, root.Backbone, root.Backgrid, root.lunr);
	  }

	}(this, function (_, Backbone, Backgrid, lunr) {

	  "use strict";

	  /**
	     ServerSideFilter is a search form widget that submits a query to the server
	     for filtering the current collection.

	     @class Backgrid.Extension.ServerSideFilter
	  */
	  var ServerSideFilter = Backgrid.Extension.ServerSideFilter = Backbone.View.extend({

	    /** @property */
	    tagName: "form",

	    /** @property */
	    className: "backgrid-filter form-search",

	    /** @property {function(Object, ?Object=): string} template */
	    template: function (data) {
	      return '<span class="search">&nbsp;</span><input type="search" ' + (data.placeholder ? 'placeholder="' + data.placeholder + '"' : '') + ' name="' + data.name + '" ' + (data.value ? 'value="' + data.value + '"' : '') + '/><a class="clear" data-backgrid-action="clear" href="#">&times;</a>';
	    },

	    /** @property */
	    events: {
	      "keyup input[type=search]": "showClearButtonMaybe",
	      "click a[data-backgrid-action=clear]": "clear",
	      "submit": "search"
	    },

	    /** @property {string} [name='q'] Query key */
	    name: "q",

	    /** @property {string} [value] The search box value.  */
	    value: null,

	    /**
	       @property {string} [placeholder] The HTML5 placeholder to appear beneath
	       the search box.
	    */
	    placeholder: null,

	    /**
	       @param {Object} options
	       @param {Backbone.Collection} options.collection
	       @param {string} [options.name]
	       @param {string} [options.value]
	       @param {string} [options.placeholder]
	       @param {function(Object): string} [options.template]
	    */
	    initialize: function (options) {
	      ServerSideFilter.__super__.initialize.apply(this, arguments);
	      this.name = options.name || this.name;
	      this.value = options.value || this.value;
	      this.placeholder = options.placeholder || this.placeholder;
	      this.template = options.template || this.template;

	      // Persist the query on pagination
	      var collection = this.collection, self = this;
	      if (Backbone.PageableCollection &&
	          collection instanceof Backbone.PageableCollection &&
	          collection.mode == "server") {
	        collection.queryParams[this.name] = function () {
	          return self.searchBox().val() || null;
	        };
	      }
	    },

	    /**
	       Event handler. Clear the search box and reset the internal search value.
	     */
	    clearSearchBox: function() {
	      this.value = null;
	      this.searchBox().val(null);
	      this.showClearButtonMaybe();
	    },

	    /**
	       Event handler. Show the clear button when the search box has text, hide
	       it otherwise.
	     */
	    showClearButtonMaybe: function () {
	      var $clearButton = this.clearButton();
	      var searchTerms = this.searchBox().val();
	      if (searchTerms) $clearButton.show();
	      else $clearButton.hide();
	    },

	    /**
	       Returns the search input box.
	     */
	    searchBox: function () {
	      return this.$el.find("input[type=search]");
	    },

	    /**
	       Returns the clear button.
	     */
	    clearButton: function () {
	      return this.$el.find("a[data-backgrid-action=clear]");
	    },


	    /**
	       Returns the current search query.
	     */
	    query: function() {
	      this.value = this.searchBox().val();
	      return this.value;
	    },

	    /**
	       Upon search form submission, this event handler constructs a query
	       parameter object and pass it to Collection#fetch for server-side
	       filtering.

	       If the collection is a PageableCollection, searching will go back to the
	       first page.
	    */
	    search: function (e) {
	      if (e) e.preventDefault();

	      var data = {};
	      var query = this.query();
	      if (query) data[this.name] = query;

	      var collection = this.collection;

	      // go back to the first page on search
	      if (Backbone.PageableCollection &&
	          collection instanceof Backbone.PageableCollection) {
	        collection.getFirstPage({data: data, reset: true, fetch: true});
	      }
	      else collection.fetch({data: data, reset: true});
	    },

	    /**
	       Event handler for the clear button. Clears the search box and refetch the
	       collection.

	       If the collection is a PageableCollection, clearing will go back to the
	       first page.
	    */
	    clear: function (e) {
	      if (e) e.preventDefault();
	      this.clearSearchBox();

	      var collection = this.collection;

	      // go back to the first page on clear
	      if (Backbone.PageableCollection &&
	          collection instanceof Backbone.PageableCollection) {
	        collection.getFirstPage({reset: true, fetch: true});
	      }
	      else collection.fetch({reset: true});
	    },

	    /**
	       Renders a search form with a text box, optionally with a placeholder and
	       a preset value if supplied during initialization.
	    */
	    render: function () {
	      this.$el.empty().append(this.template({
	        name: this.name,
	        placeholder: this.placeholder,
	        value: this.value
	      }));
	      this.showClearButtonMaybe();
	      this.delegateEvents();
	      return this;
	    }

	  });

	  /**
	     ClientSideFilter is a search form widget that searches a collection for
	     model matches against a query on the client side. The exact matching
	     algorithm can be overriden by subclasses.

	     @class Backgrid.Extension.ClientSideFilter
	     @extends Backgrid.Extension.ServerSideFilter
	  */
	  var ClientSideFilter = Backgrid.Extension.ClientSideFilter = ServerSideFilter.extend({

	    /** @property */
	    events: _.extend({}, ServerSideFilter.prototype.events, {
	      "click a[data-backgrid-action=clear]": function (e) {
	        e.preventDefault();
	        this.clear();
	      },
	      "keydown input[type=search]": "search",
	      "submit": function (e) {
	        e.preventDefault();
	        this.search();
	      }
	    }),

	    /**
	       @property {?Array.<string>} [fields] A list of model field names to
	       search for matches. If null, all of the fields will be searched.
	    */
	    fields: null,

	    /**
	       @property [wait=149] The time in milliseconds to wait since the last
	       change to the search box's value before searching. This value can be
	       adjusted depending on how often the search box is used and how large the
	       search index is.
	    */
	    wait: 149,

	    /**
	       Debounces the #search and #clear methods and makes a copy of the given
	       collection for searching.

	       @param {Object} options
	       @param {Backbone.Collection} options.collection
	       @param {string} [options.placeholder]
	       @param {string} [options.fields]
	       @param {string} [options.wait=149]
	    */
	    initialize: function (options) {
	      ClientSideFilter.__super__.initialize.apply(this, arguments);

	      this.fields = options.fields || this.fields;
	      this.wait = options.wait || this.wait;

	      this._debounceMethods(["search", "clear"]);

	      var collection = this.collection = this.collection.fullCollection || this.collection;
	      var shadowCollection = this.shadowCollection = collection.clone();

	      this.listenTo(collection, "add", function (model, collection, options) {
	        shadowCollection.add(model, options);
	      });
	      this.listenTo(collection, "remove", function (model, collection, options) {
	        shadowCollection.remove(model, options);
	      });
	      this.listenTo(collection, "sort", function (col) {
	        if (!this.searchBox().val()) shadowCollection.reset(col.models);
	      });
	      this.listenTo(collection, "reset", function (col, options) {
	        options = _.extend({reindex: true}, options || {});
	        if (options.reindex && options.from == null && options.to == null) {
	          shadowCollection.reset(col.models);
	        }
	      });
	    },

	    _debounceMethods: function (methodNames) {
	      if (_.isString(methodNames)) methodNames = [methodNames];

	      this.undelegateEvents();

	      for (var i = 0, l = methodNames.length; i < l; i++) {
	        var methodName = methodNames[i];
	        var method = this[methodName];
	        this[methodName] = _.debounce(method, this.wait);
	      }

	      this.delegateEvents();
	    },

	    /**
	       Constructs a Javascript regular expression object for #makeMatcher.

	       This default implementation takes a query string and returns a Javascript
	       RegExp object that matches any of the words contained in the query string
	       case-insensitively. Override this method to return a different regular
	       expression matcher if this behavior is not desired.

	       @param {string} query The search query in the search box.
	       @return {RegExp} A RegExp object to match against model #fields.
	     */
	    makeRegExp: function (query) {
	      return new RegExp(query.trim().split(/\s+/).join("|"), "i");
	    },

	    /**
	       This default implementation takes a query string and returns a matcher
	       function that looks for matches in the model's #fields or all of its
	       fields if #fields is null, for any of the words in the query
	       case-insensitively using the regular expression object returned from
	       #makeRegExp.

	       Most of time, you'd want to override the regular expression used for
	       matching. If so, please refer to the #makeRegExp documentation,
	       otherwise, you can override this method to return a custom matching
	       function.

	       Subclasses overriding this method must take care to conform to the
	       signature of the matcher function. The matcher function is a function
	       that takes a model as paramter and returns true if the model matches a
	       search, or false otherwise.

	       In addition, when the matcher function is called, its context will be
	       bound to this ClientSideFilter object so it has access to the filter's
	       attributes and methods.

	       @param {string} query The search query in the search box.
	       @return {function(Backbone.Model):boolean} A matching function.
	    */
	    makeMatcher: function (query) {
	      var regexp = this.makeRegExp(query);
	      return function (model) {
	        var keys = this.fields || model.keys();
	        for (var i = 0, l = keys.length; i < l; i++) {
	          if (regexp.test(model.get(keys[i]) + "")) return true;
	        }
	        return false;
	      };
	    },

	    /**
	       Takes the query from the search box, constructs a matcher with it and
	       loops through collection looking for matches. Reset the given collection
	       when all the matches have been found.

	       If the collection is a PageableCollection, searching will go back to the
	       first page.
	    */
	    search: function () {
	      var matcher = _.bind(this.makeMatcher(this.query()), this);
	      var col = this.collection;
	      if (col.pageableCollection) col.pageableCollection.getFirstPage({silent: true});
	      col.reset(this.shadowCollection.filter(matcher), {reindex: false});
	    },

	    /**
	       Clears the search box and reset the collection to its original.

	       If the collection is a PageableCollection, clearing will go back to the
	       first page.
	    */
	    clear: function () {
	      this.clearSearchBox();
	      var col = this.collection;
	      if (col.pageableCollection) col.pageableCollection.getFirstPage({silent: true});
	      col.reset(this.shadowCollection.models, {reindex: false});
	    }

	  });

	  /**
	     LunrFilter is a ClientSideFilter that uses [lunrjs](http://lunrjs.com/) to
	     index the text fields of each model for a collection, and performs
	     full-text searching.

	     @class Backgrid.Extension.LunrFilter
	     @extends Backgrid.Extension.ClientSideFilter
	  */
	  var LunrFilter = Backgrid.Extension.LunrFilter = ClientSideFilter.extend({

	    /**
	       @property {string} [ref="id"]｀lunrjs` document reference attribute name.
	    */
	    ref: "id",

	    /**
	       @property {Object} fields A hash of `lunrjs` index field names and boost
	       value. Unlike ClientSideFilter#fields, LunrFilter#fields is _required_ to
	       initialize the index.
	    */
	    fields: null,

	    /**
	       Indexes the underlying collection on construction. The index will refresh
	       when the underlying collection is reset. If any model is added, removed
	       or if any indexed fields of any models has changed, the index will be
	       updated.

	       @param {Object} options
	       @param {Backbone.Collection} options.collection
	       @param {string} [options.placeholder]
	       @param {string} [options.ref] ｀lunrjs` document reference attribute name.
	       @param {Object} [options.fields] A hash of `lunrjs` index field names and
	       boost value.
	       @param {number} [options.wait]
	    */
	    initialize: function (options) {
	      LunrFilter.__super__.initialize.apply(this, arguments);

	      this.ref = options.ref || this.ref;

	      var collection = this.collection = this.collection.fullCollection || this.collection;
	      this.listenTo(collection, "add", this.addToIndex);
	      this.listenTo(collection, "remove", this.removeFromIndex);
	      this.listenTo(collection, "reset", this.resetIndex);
	      this.listenTo(collection, "change", this.updateIndex);

	      this.resetIndex(collection);
	    },

	    /**
	       Reindex the collection. If `options.reindex` is `false`, this method is a
	       no-op.

	       @param {Backbone.Collection} collection
	       @param {Object} [options]
	       @param {boolean} [options.reindex=true]
	    */
	    resetIndex: function (collection, options) {
	      options = _.extend({reindex: true}, options || {});

	      if (options.reindex) {
	        var self = this;
	        this.index = lunr(function () {
	          _.each(self.fields, function (boost, fieldName) {
	            this.field(fieldName, boost);
	            this.ref(self.ref);
	          }, this);
	        });

	        collection.each(function (model) {
	          this.addToIndex(model);
	        }, this);
	      }
	    },

	    /**
	       Adds the given model to the index.

	       @param {Backbone.Model} model
	    */
	    addToIndex: function (model) {
	      var index = this.index;
	      var doc = model.toJSON();
	      if (index.documentStore.has(doc[this.ref])) index.update(doc);
	      else index.add(doc);
	    },

	    /**
	       Removes the given model from the index.

	       @param {Backbone.Model} model
	    */
	    removeFromIndex: function (model) {
	      var index = this.index;
	      var doc = model.toJSON();
	      if (index.documentStore.has(doc[this.ref])) index.remove(doc);
	    },

	    /**
	       Updates the index for the given model.

	       @param {Backbone.Model} model
	    */
	    updateIndex: function (model) {
	      var changed = model.changedAttributes();
	      if (changed && !_.isEmpty(_.intersection(_.keys(this.fields),
	                                               _.keys(changed)))) {
	        this.index.update(model.toJSON());
	      }
	    },

	    /**
	       Takes the query from the search box and performs a full-text search on
	       the client-side. The search result is returned by resetting the
	       underlying collection to the models after interrogating the index for the
	       query answer.

	       If the collection is a PageableCollection, searching will go back to the
	       first page.
	    */
	    search: function () {
	      var col = this.collection;
	      if (!this.query()) {
	        col.reset(this.shadowCollection.models, {reindex: false});
	        return;
	      }

	      var searchResults = this.index.search(this.query());
	      var models = [];
	      for (var i = 0; i < searchResults.length; i++) {
	        var result = searchResults[i];
	        models.push(this.shadowCollection.get(result.ref));
	      }

	      if (col.pageableCollection) col.pageableCollection.getFirstPage({silent: true});
	      col.reset(models, {reindex: false});
	    }

	  });

	}));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * A column manager for backgrid
	 *
	 * @module AdvancedFilter
	 */
	var _ = __webpack_require__(2);
	var Backbone = __webpack_require__(4);
	var Backgrid = __webpack_require__(5);

	/**
	 * Parent class of the advanced filter.
	 * @class AdvancedFilter.Main
	 */

	Backgrid.Extension.AdvancedFilter.Main = Backbone.View.extend({
	  className: "advancedfilter",
	  defaults: {
	    SelectorView: Backgrid.Extension.AdvancedFilter.Selector,
	    FilterView: Backgrid.Extension.AdvancedFilter.Editor,
	    SaverView: Backgrid.Extension.AdvancedFilter.Saver
	  },

	  /**
	   * @method initialize
	   * @param options
	   */
	  initialize: function(options) {
	    var self = this;
	    self.options = _.extend({}, self.defaults, options || {});
	    self.components = {};

	    if (!self.options.collection || !self.options.collection instanceof Backbone.Collection) {
	      throw new Error("AdvancedFilter: data collection is required.");
	    }

	    if (!self.options.columns || !self.options.columns instanceof Backgrid.Columns) {
	      throw new Error("AdvancedFilter: columns are required.");
	    }

	    if (!self.options.filters || (_.isArray(self.options.filter) && _.isEmpty(self.options.filter))) {
	      // No filters provided, create empty collection
	      self.options.filters = new Backgrid.Extension.AdvancedFilter.FilterCollection();
	    }

	    // Create filter state model
	    self.createFilterStateModel(self.options);
	  },

	  /**
	   * @method render
	   * @return {Main}
	   * @chainable
	   */
	  render: function() {
	    var self = this;
	    self.$el.empty();

	    // Add selector
	    var selector = self.components.selector = new self.options.SelectorView({
	      filterStateModel: self.filterStateModel
	    });
	    self.$el.append(selector.render().$el);

	    // Add editor
	    var editor = self.components.editor = new self.options.FilterView({
	      filterStateModel: self.filterStateModel
	    });
	    self.$el.append(editor.render().$el);

	    // Add saver
	    var saver = self.components.saver = new self.options.SaverView({
	      filterStateModel: self.filterStateModel
	    });
	    self.$el.append(saver.render().$el);

	    return self;
	  },

	  /**
	   * Verifies whether a given id is valid for the current filter collection.
	   * @method verifyFilterId
	   * @param {AdvancedFilter.FilterCollection} filters
	   * @param id
	   * @return {boolean}
	   */
	  verifyFilterId: function(filters, id) {
	    return filters.get(id) ? true : false;
	  },

	  /**
	   * @method createFilterStateModel
	   * @param options
	   */
	  createFilterStateModel: function(options) {
	    var self = this;

	    // Check if active filter is valid
	    var validFilter = self.verifyFilterId(options.filters, options.activeFilterId);

	    // Create filter state model
	    self.filterStateModel = new Backgrid.Extension.AdvancedFilter.FilterStateModel({
	      dataCollection: options.collection,
	      columnCollection: options.columns,
	      filterCollection: options.filters,
	      activeFilterId: (validFilter) ?
	        options.filters.get(options.activeFilterId).cid
	        : null
	    });

	    // Bind events
	    self.bindFilterStateEvents();
	  },

	  /**
	   * @method bindFilterStateEvents
	   */
	  bindFilterStateEvents: function() {
	    var self = this;
	    var fsm = self.filterStateModel;
	    self.listenTo(fsm, "filter:new", self.evtNewFilter);
	    self.listenTo(fsm, "filter:save", self.evtSaveFilter);
	    //self.listenTo(fsm, "filter:change", self.evtChangeFilter);
	    self.listenTo(fsm, "filter:reset", self.evtResetFilter);
	    self.listenTo(fsm, "filter:cancel", self.evtCancelFilter);
	    self.listenTo(fsm, "filter:remove", self.evtRemoveFilter);
	  },

	  /**
	   * Event handler for filter:new (fsm)
	   * @method evtNewFilter
	   */
	  evtNewFilter: function() {
	    var self = this;
	    var fsm = self.filterStateModel;

	    var newFilter = fsm.get("filterCollection").createNewFilter();
	    fsm.set("activeFilterId", newFilter.cid);

	    self.trigger("filter:new", newFilter.cid, newFilter);
	  },

	  /**
	   * Event handler for filter:save (fsm)
	   * @method evtSaveFilter
	   */
	  evtSaveFilter: function() {
	    var self = this;
	    var fsm = self.filterStateModel;
	    var filter = fsm.getActiveFilter();
	    if (filter) {
	      filter.saveFilter();
	      self.trigger("filter:save", filter.cid, filter);
	    }
	  },

	/*  /!**
	   * Event handler for filter:change (fsm)
	   * @method evtChangeFilter
	   *!/
	  evtChangeFilter: function(filterModel) {
	    var self = this;
	    self.trigger("filter:change", filterModel.cid, filterModel);
	  },*/

	  /**
	   * Event handler for filter:reset (fsm)
	   * @method evtResetFilter
	   */
	  evtResetFilter: function() {
	    var self = this;
	    var activeFilter = self.filterStateModel.getActiveFilter();
	    activeFilter.resetFilter();

	    self.trigger("filter:reset", activeFilter.cid, activeFilter);
	  },

	  /**
	   * Event handler for filter:cancel (fsm)
	   * @method evtCancelFilter
	   */
	  evtCancelFilter: function() {
	    var self = this;
	    var currentFilter = self.filterStateModel.getActiveFilter();
	    var stateBeforeCancel = {
	      name: currentFilter.get("name"),
	      attributeFilters: currentFilter.get("attributeFilters") ? currentFilter.get("attributeFilters").toJSON() : null
	    };

	    currentFilter.cancelFilter();

	    self.trigger("filter:cancel", currentFilter.cid, currentFilter, stateBeforeCancel);
	  },

	  /**
	   * Event handler for filter:remove (fsm)
	   * @method evtRemoveFilter
	   */
	  evtRemoveFilter: function() {
	    var self = this;
	    var fsm = self.filterStateModel;
	    var filterId = fsm.get("activeFilterId");
	    var filter = fsm.get("filterCollection").get(filterId);
	    var filterName = filter.get("name");

	    fsm.set("activeFilterId", null);
	    fsm.get("filterCollection").remove(filter);
	    self.trigger("filter:remove", filterId, filterName);
	  },

	  /**
	   * Clean up this control
	   *
	   * @method remove
	   * @chainable
	   */
	  remove: function () {
	    var self = this;

	    // Remove sub components
	    self.components.selector.remove();
	    self.components.editor.remove();
	    self.components.saver.remove();

	    // Invoke original backbone methods
	    return Backbone.View.prototype.remove.apply(self, arguments);
	  }
	});


/***/ }
/******/ ])
});
;