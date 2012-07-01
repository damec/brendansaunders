// Anonymous function to avoid interference
// Borrowed the shell of this from http://alexmarandon.com/articles/web_widget_jquery/
(function() {

	var jQuery;
	
	/** Load jQuery if not present **/
	if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.7.2') {
	    var script_tag = document.createElement('script');
	    script_tag.setAttribute("type","text/javascript");
	    script_tag.setAttribute("src",
	        "http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js");
	    if (script_tag.readyState) {
	      script_tag.onreadystatechange = function () { // For old versions of IE
	          if (this.readyState == 'complete' || this.readyState == 'loaded') {
	              scriptLoadHandler();
	          }
	      };
	    } else { // Other browsers
	      script_tag.onload = scriptLoadHandler;
	    }
	    // Try to find the head, otherwise default to the documentElement
	    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
	} else {
	    // The jQuery version on the window is the one we want to use
	    jQuery = window.jQuery;
	    startStore();
	}
	
	/** Called once jQuery has loaded **/
	function scriptLoadHandler() {
	    // Restore $ and window.jQuery to their previous values and store the
	    // new jQuery in our local jQuery variable
	    jQuery = window.jQuery.noConflict(true);
	    // Let's kick it off
	    startStore(); 
	} // end scriptLoadHandler()
	
	function startStore() { 
	    jQuery(function ($) {

	    	var $widgetContainer = $("#storenvy-widget");
	    	// In order to append to the iframe we have to grab the document, and then open and close it first.
	    	var iframe = $widgetContainer[0].contentWindow.document;
	    	iframe.open();
	    	iframe.close();

	    	// Append some styles to reset the iframe styles
	    	$("head").append("<style> #storenvy-widget { display: block; border: 0; margin: 0 auto; outline: 0; padding: 0; max-height: 600px !important;}</style>");

	    	// Generate main css file
	    	var cssLink = $("<link>", { 
    			rel: "stylesheet", 
    			type: "text/css", 
    			href: "http://jollyrogerltd.com/css/widget/store.css" 
				});
				
				// Append main css file
				$("head", iframe).append(cssLink);
				// Append our store container
				$("body", iframe).append("<div id='store'></div>");

	    	var $storeContainer = $("#store", iframe);
	    	var subdomain = $widgetContainer.data("subdomain");
	    	var productsLimit = $widgetContainer.data("limit");

	    	// build the API call
	    	var storeResultsUrl = "http://api.storenvy.com/v1/" + subdomain + ".json?api_key=unicorn_sandwich&callback=?";
				
				// call out to the api and build html on response
				var apiCall = $.getJSON(storeResultsUrl, function(response) {
					var store = response.store;
					var products = store.products;
					var limit;
					var html = "";
					var inStockProducts = [];

					// Loop through and grab only the instock products
					for (var i=0; i<products.length; i++) {
						if ( !products[i].sold_out ) {
							inStockProducts.push(products[i]);
						}
					}

					// Check to see if a useable limit was specified
					if ( productsLimit && productsLimit > 0 ) {
						if ( inStockProducts.length >= productsLimit ) {
							limit = productsLimit;
						} else {
							limit = inStockProducts.length;
						}
					} else {
						limit = inStockProducts.length;
					}
					
					//start appending the html
					$storeContainer.append("<h3 class='header'><img class='avatar' src='" + store.avatar + "' title='" + store.name + "' alt='" + store.name + " user avatar'><span>" + store.name + "</span><span><a class='store-link' href='" + store.url + "'>Visit Store</a></span></h3>")
    			      				 .append("<div id='products-container'><ul id='product-gallery'></div>");

    			if ( inStockProducts.length > 0 ) {
    				for ( var i=0; i<limit; i++ ) {
    					html += "<li class='product'>";
							html += "<div class='front'>";
							html += "<img src='" + inStockProducts[i].photos[0].medium + "' />";
							html += "<span class='price'>" + inStockProducts[i].price + "</span>";
							html += "</div><div class='back'>";
							html += "<span class='price'>" + inStockProducts[i].price + "</span>";
							html += "<div class='details'><strong>" + inStockProducts[i].name + "</strong><p>" + inStockProducts[i].category + "</p></div>";
							html += "<form class='add-to-cart-form' action='https://www.storenvy.com/cart' method='post' target='_blank' >";
    					html += "<select name='variant_id' id='" + inStockProducts[i].id + "'>";
							for ( v=0; v<inStockProducts[i].variants.length; v++) {
								// only display variant option if there is stock
								if (inStockProducts[i].variants[v].quantity > 0) {
									html += "<option value='" + inStockProducts[i].variants[v].id + "'>" + inStockProducts[i].variants[v].name + "</option>";
								}
							}
    					html += "</select><br/>";
							html += "<input type='submit' class='add-to-cart-button' value='Add to Cart'/>";
							html += "</form>";
							html += "</div>";  
							html += "</li>";
							$storeContainer.find("#product-gallery").append(html);
							// clear html var for next product
							html = "";
    				}
    				// if there are an odd number of products show a block to visit the store.
						if ( limit % 2 !== 0 ) {
							html += "<li class='visit'><img src='" + store.avatar + "' /><div class='overlay'><p>" + store.name + "</p><a href='" + store.url + "' target='_blank'>Visit Store</a></div></li>";
							$storeContainer.find("#product-gallery").append(html);
							html = "";
						}
    			} else {
    				//show no results error
    				html += "<li class='no-results'><strong>Clean up on aisle 4...</strong><p>Looks like there are no products to show right now.</p><small>Why not <a href='http://www.storenvy.com/stores' target='_blank'>browse</a> some of the other great Storenvy stores?</small></p></li>";
    				$storeContainer.find("#product-gallery").append(html);
    				html = "";
    			}
				}); // end apiCall()

	    }); // end jQuery domReady()
	} // end startStore()

})(); // end Anon()