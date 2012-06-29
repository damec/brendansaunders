//Anonymous function to avoid interference
(function() {

	var storeResults = $.get(
		"http://api.storenvy.com/v1/grooveshark.json?api_key=unicorn_sandwich&callback=processStoreResults",
		processStoreResults,
		"jsonp"
	);
	
	function processStoreResults(response) {
	  var storeName = response.store.name;
	  var storeUrl = response.store.url;
	  console.log(storeName);
	  console.log(storeUrl);
	}
	
	var  output = Mustache.render( "{{processStoreResults.store.name}}", storeResults);

})();