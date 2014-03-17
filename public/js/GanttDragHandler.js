define(function(){
	return GanttDragHandler;
	
	/**
	 * Intended to handle drag-events on gantt-grid. To be used as
	 * prototype for GanttController. Uses GanttView.
	 */
	function GanttDragHandler(){
		this.$curr = undefined; // current dragged cell
		
		/**
		 * Handles a dragstart by setting the $curr.
		 */
		this.handleDragstart = function(event, dragdrop){
			var $cell = jQuery(dragdrop.drag);
			if(!this.checkStartPermitted($cell)){				
				return false;
			}
			this.$curr = $cell;			
		};
		
		/**
		 * Based on the given gantt-cell, this method contains logic
		 * to decide if a drag start is permitted.
		 * Default: cell must be either of state 'start', 'end', or not 'marked'.
		 * @returns boolean : true if allowed 
		 */
		this.checkStartPermitted = function($cell){
			return $cell.hasClass(this.cellStates.start) || 
				   $cell.hasClass(this.cellStates.end) ||
				  !$cell.hasClass(this.cellStates.marked);
		};
		
		/**
		 * Handles a drag-event by deciding if element is allowed for drag and in case
		 * calls to changeCellState and resets $curr.
		 */
		this.handleDrag = function(event, dragdrop){
			var $cell = extractDraggedCell(event);			
			
			if($cell != null && this.$curr.get(0) !== $cell.get(0) && this.checkAllowedAsNext($cell)){
				// moving from a marked to a neighbour
				this.changeCellState($cell);
				this.$curr = $cell;				
			} 
			else if($cell != null && this.$curr.get(0) === $cell.get(0) && !this.$curr.hasClass(this.cellStates.marked)){
				// starting dragging at an unmarked
				this.changeCellState($cell);
			}
			return true;
		};
		
		/**
		 * Checks the given cell to be allowed as next cell.
		 * @returns boolean
		 */
		this.checkAllowedAsNext = function($cell){
			// check same row
			if($cell.attr('data-rowid') !== this.$curr.attr('data-rowid')){
				return false;
			}			
			// check is neighbour
			if(Math.abs($cell.attr('data-colidx') - this.$curr.attr('data-colidx')) > 1){
				return false;
			}
			// check not hitting other line
			if(($cell.attr('data-lineid') != null) && $cell.attr('data-lineid') !== this.$curr.attr('data-lineid')){
				return false;
			}
			return true;
		};
		
		/**
		 * Changes the state of the given cell, based on its current state and the $curr -cell.
		 * It is assumed the cell is valid for drag.
		 * Overwrite if custom-cell styles/attr are used.
		 */
		this.changeCellState = function($cell) {
			if ($cell.hasClass('marked')) {
				// next is marked - it's a shrinkage of the line
				this.view.copyState(this.$curr, $cell);
				// clean current
				this.view.removeCellStates(this.$curr);
			} else if($cell.get(0) !== this.$curr.get(0)) {
				// it's an extention of the line
				this.view.copyState(this.$curr, $cell);
				if (this.$curr.attr('data-colidx') < $cell.attr('data-colidx')) {
					// in case $curr was start and end					
					$cell.removeClass(this.cellStates.start);
					this.$curr.removeClass(this.cellStates.end);
				} else {
					$cell.removeClass(this.cellStates.end);
					this.$curr.removeClass(this.cellStates.start);
				}
			} else{
				// it's a start of a NEW line
				this.view.addCellState($cell, null, 0);
			}
		};
		
		
		/**
		 * From the given drag-event (mouseover), extract the gantt-cell or returns
		 * null in case it doesn't exist.
		 */
		function extractDraggedCell(event){
			var $cell = null;
			var $closest = jQuery(event.target).closest('.cells .cell');
			if($closest.size() > 0){
				$cell = $closest;
			}
			return $cell;
		}
		
		/**
		 * Overwrite this to handle drag-end.
		 */
		this.handleDragend = function(event, dragdrop){			
		};
	}
	
});