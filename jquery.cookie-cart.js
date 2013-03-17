/**
 * jQuery Cookie Cart
 * Designed: David Dietrich
 * Date: 2013.03.17.
 * Time: 9:24
 * Copyright David Dietrich
 *
 * Version 0.1
 *
 * 	Simple cart management with cookie. You can add and remove items from the cart.
 * 	You're able to store the items as Objects. Only 3 properties are required:
 * 		prod_id: the id of the product it can be anything
 * 		qty : the quantity of the product
 * 		price: the price of the product
 */

/**
 * Samples:
 *
 * $.cCart({'debug': true}); // Set the the debug mode on
 * $.cCart('clear'); // Clear the cart
 *
 ---------------------
 Add item to cart:
 $.cCart('add', {
	'prodid' : 'pwn_01',
	'name':  'Prod 1',
	'qty':   2,
	'price': 4900
 });
 ---------------------
 Remove item from cart
 $.cCart('remove', {
	'prodid' : 'pwn_01',
	'name':  'Prod 1',
	'qty':   2,
	'price': 4900
});
 *
 *
 */



(function ($) {

	//Default settings
	var defs = {
		'cartname': 'cCart',		// The name of the cart in the cookie
		'debug':    false			// Debug mode
	}

	var Sum = 0;

	$.cCart = function (options, func, arg) {

		if (options && typeof(options) == 'object') {
			defs = $.extend(defs, options);
		}

		var cart = $.cookie(defs.cartname);

		if (cart == null) {
			cart = 'empty';
			$.cookie(defs.cartname, cart);
			console.debug($.cookie(defs.cartname));
		}

		if (options && typeof(options) == 'string') {
			if (options == 'clear') {
				cCart_clear(func);
			}
			else if (options == 'add') {
				cCart_add(func);
			}else if (options == 'remove') {
				cCart_remove(func);
			}else if (options == 'getItems') {
				return cCart_getCartItems(func);
			}else if (options == 'count') {
				return cCart_getCountItems(func);
			} else if (options == 'getSum') {
				return cCart_getSum(func);
			}
			return;
		}

		// Private -------------------------------------------------

		function calcSum(recalc) {
			Sum = 0;
			if ($.cookie(defs.cartname) != 'empty') {
				cart = JSON.parse($.cookie(defs.cartname));
				for (i = 0; i < cart.items.length; i++) {
					Sum += cart.items[i].qty * cart.items[i].price;
				}
			}
		}

		// Public ---------------------------------------------------

		/**
		 * Clears the cart
		 * @param arg
		 */
		function cCart_clear(arg) {
			$.cookie(defs.cartname, 'empty')
			if (defs.debug)
				console.log('Cart cleared...');
		}

		/**
		 * Adds an item to the cart, if it is already in the cart than increases the qty
		 * @param arg {Object} : The item to add to the cart
		 */
		function cCart_add(arg) {

			var cart = null;
			var found = false;

			if ($.cookie(defs.cartname) == 'empty') {
				cart = {"items": new Array()};
				$.cookie(defs.cartname, JSON.stringify(cart));
			}
			cart = JSON.parse($.cookie(defs.cartname));

			for (i = 0; i < cart.items.length; i++) {
				if (cart.items[i].prodid == arg.prodid) {
					cart.items[i].qty += arg.qty;
					found = true;
					continue;
				}
			}

			if (!found) {
				cart.items[cart.items.length] = arg;
			}

			$.cookie(defs.cartname, JSON.stringify(cart));

			calcSum();

			if (defs.debug)
				console.log('Added ' + JSON.stringify(arg));
		}

		/**
		 * Removes an item from the by the given argument
		 * @param arg {Object}:  The item to remove
		 */
		function cCart_remove(arg){
			if ($.cookie(defs.cartname) == 'empty') {
				return
			}else{
				var cart = JSON.parse($.cookie(defs.cartname));
				for(i=0; i < cart.items.length; i++){
					if(cart.items[i].prodid == arg.prodid){
						cart.items = cart.items.slice(i + 1);
						$.cookie(defs.cartname, JSON.stringify(cart));
						calcSum();
						if(defs.debug)
							console.log('Item removed: ' + JSON.stringify(arg));
						continue;
					}
				}
			}
		}

		/**
		 *	Returns an array of the items in the cart
		 * @returns {array}
		 */
		function cCart_getCartItems(){
			if((cart = $.cookie(defs.cartname)) != 'empty'){
				return JSON.parse(cart);
			}else{
				return new Array();
			}
		}

		/**
		 *	Returns the number of items in the cart
		 * @param arg Boolean if true returns sumproduct else returns the length of the items array
		 * @returns {int}
		 */
		function cCart_getCountItems(arg){
			var itemCount = 0;
			if((cart = $.cookie(defs.cartname)) != 'empty'){
				cart = JSON.parse(cart);
				if(arg == true){
					for(i = 0; i < cart.items.length; i++){
						itemCount += cart.items[i].qty;
					}
					return itemCount;
				}else{
					return cart.items.length;
				}
			}else{
				return 0;
			}
		}


		/**
		 *	Returns the SUM of the cart
		 * @param arg Boolean if true skips the recalculation of the sum
		 * @returns {int}
		 */
		function cCart_getSum(arg) {
			if (arg && arg == true) {
				if(defs.debug)
					console.log('Skipping sum recalc...');
			}
			else {
				calcSum();
				if(defs.debug)
					console.log('Recalculating sum...');
			}
			return Sum;
		}
	};

})(jQuery);