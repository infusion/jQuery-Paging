jQuery Paging Plugin
====================

Description
-----------
The jQuery Paging plugin aims to be simple as possible by a native callback design, which in turn allows to design a pagination navigation in almost every feasible variation.

Usage
-----
Include the jquery.paging.min.js in your website and start working. There are no styles shipped with the library, it all depends on your needs and the library only does the link calculations and event management for you, plus a few extra things.

In order to use the Paging plugin, you're done by defining the following simple snippet:

	$(".pagination").paging(1337, { // make 1337 elements navigatable
	        format: '[< ncnnn! >]', // define how the navigation should look like
	        perpage: 10, // show 10 elements per page
	        lapping: 0, // don't overlap pages for the moment
	        page: 1, // start at page, can also be "null" or negative
	        onSelect: onSelectCB, // callback is called when user selects a page
	        onFormat: onFormatCB // callback is called once for every "format" element
		}
	});


Examples and documentation
==========================
For further details and code examples take a look at the demonstration and documentation page on:

http://www.xarg.org/2011/09/jquery-pagination-revised/