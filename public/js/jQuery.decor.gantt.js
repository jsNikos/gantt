define(['./GanttController', 'jquery.event.drag-2.2', 'underscore'], function(GanttController){

	/**
	 * For documentation of options, see GanttController.
	 * @param options : {rows: [RowModel], columns: [ColumnModel] , lines: [LineModel]}
	 */
	jQuery.fn.ganttDecor = function(options, args){	
		var constrArgs = _.chain({$container : jQuery(this)}).extend(options).value();
		new GanttController(constrArgs);
	};
	
});