jQuery Paging Plugin
====================

Description
-----------
The jQuery Paging plugin aims to be simple as possible by a native callback design, which in turn allows to design a pagination navigation in almost every feasible variation.

Usage
-----
Include the jquery.paging.min.js in your website and start working. There are no styles shipped with the library, it all depends on your needs and the library only does the link calculations and event management for you, plus a few extra things.

In order to use the Paging plugin, you're done by defining the following simple snippet:

	var prev = [0, 0],
	    cont = $('#content div.element');

	$(".pagination").paging(1337, { // make 1337 elements navigatable
	        format: '[< ncnnn! >]', // define how the navigation should look like
	        perpage: 10, // show 10 elements per page
	        lapping: 0, // don't overlap pages for the moment
	        page: 1, // start at page, can also be "null" or negative
	        onSelect: function (page) {

	                var data = this.slice;

	                cont.slice(prev[0], prev[1]).css('display', 'none');
	                cont.slice(data[0], data[1]).fadeIn("slow");

	                prev = data;

	                return true; // locate!
	        },
	        onFormat: function(type) {

			switch (type) {
			case 'block':

				if (!this.active)
					return '<span class="disabled">' + this.value + '</span>';
				else if (this.value != this.page)
					return '<em><a href="#' + this.value + '">' + this.value + '</a></em>';
				return '<span class="current">' + this.value + '</span>';

			case 'next':

				if (this.active) {
					return '<a href="#' + this.value + '" class="next">Next »</a>';
				}
				return '<span class="disabled">Next »</span>';

			case 'prev':

				if (this.active) {
					return '<a href="#' + this.value + '" class="prev">« Previous</a>';
				}
				return '<span class="disabled">« Previous</span>';

			case 'first':

				if (this.active) {
					return '<a href="#' + this.value + '" class="first">|<</a>';
				}
				return '<span class="disabled">|<</span>';

			case 'last':

				if (this.active) {
					return '<a href="#' + this.value + '" class="prev">>|</a>';
				}
				return '<span class="disabled">>|</span>';

			case 'fill':
				if (this.active) {
					return "...";
				}
			}
		}
	});


Examples and documentation
==========================
For further details and code examples take a look at the demonstration and documentation page on:

http://www.xarg.org/2011/09/jquery-pagination-revised/