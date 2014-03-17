// template for rendering gantt-grid based. Parameters are: 'columns' ([ColumnModel]), 'rows' ([RowModel])
define(function(){	
	var tmpl = '  '
	+' <!-- the columns of the grid --> '
	+' <div class="cols-container"> '
	+' <div class="columns">	 '
	+' 	<% _.chain(columns).each(function(column){ %> '
	+' 		<div class="tableCell" data-id="<%- column.id %>"> '
	+' 			<div class="content"><div><%- formatColumnLabel(column) %></div></div> '
	+' 		</div> '
	+' 	<% }); %>	 '
	+' </div> '
	+' </div> '
	+'  '
	+' <!-- vertical scrolling container --> '
	+' <div class="vscroller"> '
	+'  '
	+' 	<!-- the rows of the grid -->  '
	+' 	<div class="rows"> '
	+' 	<% _.chain(rows).each(function(row){ %> '
	+' 		<div class="tableCell" data-id="<%- row.id %>"> '
	+' 			<div class="content" title="<%- row.label %>"><%- row.label %></div> '
	+' 		</div> '
	+' 	<% }); %> '
	+' 	</div> '
	+'  '
	+' 	<!-- the cells of the grid --> '
	+' 	<div class="cell-container"> '
	+' 		<div class="cells"> '
	+' 		<% _.chain(rows).each(function(row){ %> '
	+' 			<div class="row" data-rowid="<%- row.id %>"> '
	+' 			<% _.chain(columns).each(function(column, colidx){ %> '
	+' 				<div class="cell tableCell" data-rowid="<%- row.id %>"  '
	+' 								 data-columnid="<%- column.id %>"  '
	+' 								 data-colidx="<%- colidx %>"> '
	+' 					<div class="content"></div> '
	+' 				</div> '
	+' 			<% }); %> '
	+' 			</div> '
	+' 		<% }); %>		 '
	+' 		</div> '
	+' 	</div> '
	+' </div> '
	+'  '
	+' <!-- horizontal scroller --> '
	+' <div class="hscroller"> '
	+' 	<div class="fake"></div> '
	+' </div> '
	+'  ';
	
	return _.template(tmpl);
});