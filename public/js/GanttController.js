define(['./GanttView', './GanttDragHandler', 'jquery.event.drag-2.2'], function(GanttView, GanttDragHandler){
	if(!window._){
		throw new Error('underscore.js is required!');
	}	
	
	/**
	 * Controller for a Gantt-chart.
	 * @param args : {$container,
	 * 				   rows: [RowModel],
	 * 				columns: [ColumnModel],
	 * 				  lines: [LineModel],
	 * 			    cellWidth,
	 * 			     rowWidth}, $container - the container in which the chart is drawn.
	 * @constructor
	 */
	function GanttController(args){
		var scope = this;
		this.view = undefined;
		
		// options:
		this.cellWidth = 30;
		this.rowWidth = 40;
		this.readonly; // makes view read-only
		this.customCellStates = {}; // custom cell states
		this.onLineDrawn = function(ganttController, lineModel){}; // called whenever a line is drawn from model
		// called whenever a cell of a line is drawn, 'columnIdx' is relative to line's columns
		this.onLineCellDrawn = function(ganttController, $cell, line, columnIdx){};
		// if given, is used instead of default: function(ganttController, $cell, line, columnIdx) - adds state to rendered cell
		this.addCellState = undefined; 
		this.formatColumnLabel = function(column){ return column.label; }; // called when column's label is rendered - method can return html
	
		
		// models:
		this.rows = []; // [RowModel]
		this.columns = []; // [ColumnModel]
		this.lines = []; // [LineModel] 
		
		// cell-states, state a gantt-cell can get
		this.cellStates = {
			black: 'black', /* default marking-color (class-name) */
			marked: 'marked', /* a cell is marked */
			start: 'start',  /* a cell is start of line */
			end: 'end' /* a cell is end of line */
		};
		

		function init() {
			_.chain(scope).extend(args);
			_.chain(scope.cellStates).extend(scope.customCellStates);
		
			// init view
			scope.view = new GanttView({
				$container : args.$container,
				controller : scope
			});
		}
		
		
		
		init();
	};
	
	
	/**
	 * Model for a row.
	 */
	function RowModel(){
		// String
		this.id;
		// String
		this.label;
		
	}
	
	/**
	 * Model for a column.
	 */
	function ColumnModel(){
		// String
		this.id;
		// String
		this.label;
	}
	
	/**
	 * Model for a marked area (line) in the chart.
	 */
	function LineModel(){
		this.id; // String
		this.columns = []; // [ColumnModel]
		this.row; // RowModel
	}
	
	return function(args){
		GanttController.prototype = new GanttDragHandler();
		return new GanttController(args);
	}; 
	
	
});

