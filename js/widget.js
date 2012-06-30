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

	    	////attach css
	    	//var cssLink = $("<link>", { 
    		//	rel: "stylesheet", 
    		//	type: "text/css", 
    		//	href: "css/widget/store.css" 
				//});
				//cssLink.appendTo('head');

	    	var $storeContainer = $("#store");
	    	var subdomain = $storeContainer.data("subdomain");
	    	var productsLimit = $storeContainer.data("limit");

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
    			      				 .append("<ul id='product-gallery'>");

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
    				html += "<li class='product'>";
    				html += "<div class='front'>";
  					html += "<img src='" + products[i].photos[0].medium + "' />";
  					html += "<span class='price'>" + products[i].price + "</span>";
  					html += "</div><div class='back'>";
  					html += "<span class='price'>" + products[i].price + "</span>";
  					html += "<div class='details'><strong>" + products[i].name + "</strong><p>" + products[i].category + "</p></div>";
  					html += "<form class='add-to-cart-form' action='https://www.storenvy.com/cart' method='post' target='_blank'>";
    				html += "<select name=variant_id id=" + products[i].id + ">";
						for ( v=0; v<products[i].variants.length; v++) {
							// make sure there is stock
							if (products[i].variants[v].quantity > 0) {
								html += "<option value='" + products[i].variants[v].id + "'>" + products[i].variants[v].name + "</option>";
							}
						}
    				html += "</select><br>";
            html += "<input type='submit' class='add-to-cart-button' value='Add to Cart'/>";
          	html += "</form>";
    				html += "</div>";  
    				html += "</li>";
    				$storeContainer.children("#product-gallery").append(html);
    			}
    			// if odd number of products, show callout tile
    			if (limit % 2) {
    				var html = "<li class='product callout'></div>";
    				$storeContainer.children("#product-gallery").append(html);
    			}

				});

	    });
	}

})();