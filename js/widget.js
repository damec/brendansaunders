//Anonymous function to avoid interference
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
	    // let's kick it off
	    startStore(); 
	}
	
	function startStore() { 
	    jQuery(function ($) {

	    	var $widgetContainer = $("#storenvy-widget");
	    	var iframe = $widgetContainer[0].contentWindow.document;
	    	iframe.open();
	    	iframe.close();

	    	$("head").append("<style> #storenvy-widget { display: block; border: 0; margin: 0 auto; outline: 0; padding: 0;}</style>");

	    	//attach css
	    	var cssLink = $("<link>", { 
    			rel: "stylesheet", 
    			type: "text/css", 
    			href: "http://brendansaunders.me/css/widget/store.css" 
				});
				
				$("head", iframe).append(cssLink);
				$("body", iframe).append("<div id='store'></div>");

	    	var $storeContainer = $("#store", iframe);
	    	var subdomain = $widgetContainer.data("subdomain");
	    	var productsLimit = $widgetContainer.data("limit");

	    	// build the API call
	    	var storeResultsUrl = "http://api.storenvy.com/v1/" + subdomain + ".json?api_key=unicorn_sandwich&callback=?";
				
				// call out to the api and build html on response
				var apiCall = $.getJSON(storeResultsUrl, function(response) {
					var store = response.store;
					console.log(store);
					var products = store.products;
					var limit;
					var productTmpl = "<li class='product'><div class='front'></div><div class='back'></div></li>";
					//console.log(store);
					
					//start appending the html
					$storeContainer.append("<h3 class='header'><img class='avatar' src='" + store.avatar + "' title='" + store.name + "' alt='" + store.name + " user avatar'><span>" + store.name + "</span><span><a class='store-link' href='" + store.url + "'>Visit Store</a></span></h3>")
    			      				 .append("<div id='products-container'><ul id='product-gallery'></div>");

    			//check to see if a limit was specified
    			if (productsLimit) {
    				// if total products are <= user specified limit show all, otherwise obey limit
    				products.length <= productsLimit ? limit = products.length : limit = productsLimit;
    			// if no specified limit given, show all products
    			}	else {
    				limit = products.length
    			}
    			for ( i=0; i<limit; i++) {
    				var html = "";
    				// hide sold out products
    				if( !products[i].sold_out ) {
    					html += "<li class='product'>";
    					html += "<div class='front'>";
  						html += "<img src='" + products[i].photos[0].medium + "' />";
  						html += "<span class='price'>" + products[i].price + "</span>";
  						html += "</div><div class='back'>";
  						html += "<span class='price'>" + products[i].price + "</span>";
  						html += "<div class='details'><strong>" + products[i].name + "</strong><p>" + products[i].category + "</p></div>";
  						html += "<form class='add-to-cart-form' action='https://www.storenvy.com/cart' method='post' target='_blank'>";
  						// hide dropdown if only one variant
  						if ( products[i].variants.length > 1 ) {
    						html += "<select name=variant_id id=" + products[i].id + ">";
								for ( v=0; v<products[i].variants.length; v++) {
									// make sure there is stock
									if (products[i].variants[v].quantity > 0) {
										html += "<option value='" + products[i].variants[v].id + "'>" + products[i].variants[v].name + "</option>";
									}
								}
    						html += "</select><br/>";
    					}
            	html += "<input type='submit' class='add-to-cart-button' value='Add to Cart'/>";
          		html += "</form>";
    					html += "</div>";  
    					html += "</li>";
    				}
    				$storeContainer.find("#product-gallery").append(html);
    			}
				});

	    });
	}

})();