define(['./ganttGridTmpl'], function(gridTmpl) {
	/**
	 * View for gantt-chart.
	 * @constructor
	 * @param args : {controller}
	 */
	function GanttView(args) {
		var scope = this;
		var controller = args.controller;		

		// el's		
		var $container = args.$container || jQuery('.container.gantt');
		var $colsContainer = undefined;
		var $columns = undefined;
		var $rows = undefined;
		var $cellContainer = undefined;
		var $ganttTable = undefined;
		var $hscroller = undefined;
		var $vscroller = undefined;

		// layout settings
		var cellWidth = controller.cellWidth;	
		var cellHeight = controller.cellHeight || cellWidth;
		var rightPadding = 30;
		var bottomPadding = 30;
		var rowWidth = controller.rowWidth;	
		
		function init() {
			checkToOverwriteDefault('addCellState');
			
			// draw grid
			drawGrid();	
			applyLines(); 
			if(!controller.readonly){
				initDragListeners();	
			}
		}
		
		/**
		 * Checks if default impl. must be overwritten because alternative is given
		 * in options.
		 * @param functionName : String
		 */
		function checkToOverwriteDefault(functionName){
			var func = controller[functionName]; 
			if(func){
				scope[functionName] = func.bind(scope, controller);
			}
		}
		
		/**
		 * Registers drag-listener on gantt-cells.
		 */
		function initDragListeners(){
			jQuery('.cell', $ganttTable)
					.on('dragstart', controller.handleDragstart.bind(controller))
					.on('drag', controller.handleDrag.bind(controller))
					.on('dragend', controller.handleDragend.bind(controller));
		}
		
		/**
		 * Apply lines from model onto grid. First clears-out all from grid.
		 */
		function applyLines(){			
			scope.clearLines();
			_.chain(controller.lines).each(function(line){
				_.chain(line.columns).each(function(column, columnIdx){				
					var $cell = $findCell(line.row, column);
					scope.addCellState($cell, line, columnIdx);
					controller.onLineCellDrawn(controller, $cell, line, columnIdx);
				});
				controller.onLineDrawn(controller, line);
			});
		};
		
		/**
		 * Based in given coord. contains the logic to add styles and data
		 * to the underlying cell. Overwrite for specific logic.
		 * Default style classes are: 'marked', 'black', 'start', 'end'
		 * @param $cell : the cell to be styled
		 * @param line : line to which the cell belongs, maybe 'null' if is marked by CREATE
		 * @param columnIdx : column-idx of cell in line
		 */
		this.addCellState = function($cell, line, columnIdx){			
			$cell.addClass(_. chain(controller.cellStates).pick(['marked', 'black']).values().value().join(' '))
			   .attr('data-lineid', line && line.id);
			if(columnIdx === 0){
				// it's a start
				$cell.addClass(controller.cellStates.start);
			}
			if(!line && columnIdx === 0){
				// it's an end too, because created through drag
				$cell.addClass(controller.cellStates.end);
			}
			if(line && columnIdx + 1 === line.columns.length){
				// it's an end
				$cell.addClass(controller.cellStates.end);
			}
		};
		
		/**
		 * Removes all state infos on given cell in order to make it a blank-cell.
		 * Overwrite if custom state-infos are used.
		 * @param $cell
		 */
		this.removeCellStates = function($cell){
			$cell.removeClass(_.values(controller.cellStates).join(' '))
			   .removeAttr('data-lineid');
		};
		
		/**
		 * Clears all lines from view. Overwrite this if custom
		 * style-classes or attributes are applied on cells.
		 */
		this.clearLines = function(){
			jQuery('.cell', $ganttTable).each(function(){
				scope.removeCellStates(jQuery(this));
			});			
		};
		
		/**
		 * Copies all cell-states from source to target gantt-cell.
		 * (including data)
		 * @param $source
		 * @param $target
		 */
		this.copyState = function($source, $target){
			_.chain(controller.cellStates).values().each(function(state){
				if($source.hasClass(state)){
					$target.addClass(state);
				}
			});
			$target.attr('data-lineid', $source.attr('data-lineid'));
		};
		
		/**
		 * Returns the cell in grid for given coord.
		 * @param row
		 * @param column
		 */
		function $findCell(row, column){			
			return jQuery('.cell[data-rowid="'+row.id+'"][data-columnid="'+column.id+'"]', $ganttTable);
		}

		/**
		 * Based on controller's rows and columns, grid is drawn into
		 * container. Cleans-up container and triggers adjustLayout. Initializes all
		 * listener.
		 */
		function drawGrid() {
			// add container styles
			$container.addClass('container gantt');
			
			// empty container
			$container.empty();
						
			// render contents into container
			$container.append(gridTmpl(controller));	
			initEls();
			
			// adjust layout components
			adjustLayout();
			initHScroller();			
		}
		
		/**
		 * Initializes el's
		 */
		function initEls(){
			$colsContainer = jQuery('.cols-container', $container);
			$columns = jQuery('.columns', $colsContainer);
			$rows = jQuery('.rows', $container);
			$cellContainer = jQuery('.cell-container', $container);
			$ganttTable = jQuery('.cells', $cellContainer);
			$hscroller = jQuery('.hscroller', $container);
			$vscroller = jQuery('.vscroller', $container);
		}

		/**
		 * Adjusts layout-components to each other. Dependencies are layoutSetting
		 * and css controlled width/height of container.
		 */
		function adjustLayout() {
			// set row-width
			$rows.width(rowWidth);

			// compute table width
			var columnsWidth = controller.columns.length * cellWidth; 
			$columns.width(columnsWidth); 
			$ganttTable.width(columnsWidth); 

			// adjust cell-dims
			jQuery('.tableCell', $ganttTable).css({  
				width : cellWidth, 
				height : cellHeight
			});
			jQuery('.tableCell', $columns).css('width', cellWidth); 

			// adjust cell-container		
			$cellContainer.css({
				left : rowWidth + 'px',
				top : '0px'
			});
			$cellContainer.width($container.width() - rowWidth - rightPadding);

			// adjust v-scroller			
			$vscroller.css({
						height : ($container.height() - $colsContainer.height() - bottomPadding) + 'px'
					});

			// adjust cols-container
			$colsContainer.css({
				'margin-left' : rowWidth -1 + 'px', /* adjusts for border */
				width : $cellContainer.width() + 'px'
			});

			// adjust rows-table
			jQuery('.tableCell', $rows).css({height: cellHeight, width: rowWidth});

			// adjust h-scroller		
			$hscroller.css({
				left : rowWidth + 'px',
				top : $colsContainer.outerHeight(),
				width : $cellContainer.width(),
				height : $container.height() - $colsContainer.outerHeight()
			});
			jQuery('.fake', $hscroller).width($ganttTable.outerWidth());
		}

		/** 
		 * Supports synchronized horizontal scrolling of cells-table and columns.
		 * h-scrolling triggers transitions of cells-table and columns.		  
		 * 
		 */
		function initHScroller() {
			$hscroller.on('scroll', function(event) {
				var scroll = $hscroller.scrollLeft();
				$ganttTable.css('left', -scroll + 'px');
				$columns.css('left', -scroll + 'px');
			});
		}

		init();
		
		
		
	}

	return GanttView;
});