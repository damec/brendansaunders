$(function(){	
	$("#widget-builder").on("submit", function(e){
		e.preventDefault();
	
		var subdomain = $("#subdomain").val();
		var limit = $("#limit").val();
		
		var script = '<script src="http://jollyrogerltd.com/js/widget.js"></script>';
		var iframe = '<iframe id="storenvy-widget" data-subdomain="' + subdomain + '" data-limit="' + limit + '" width="490" height="600"></iframe><!-- /#storenvy-widget -->';

		$("#snippet").val(script + iframe);
	});
});