jQuery Paging Plugin
====================

Description
-----------
The jQuery Paging plugin aims to be simple as possible by a native callback design, which in turn allows to design a pagination navigation in almost every feasible variation.

Usage
-----
Include the jquery.paging.min.js in your website and start working. There are no styles shipped with the library, it all depends on your needs and the library only does the link calculations and event management for you, plus a few extra things.

In order to use the Paging plugin, you're done by defining the following simple snippet:

```javascript
$(".pagination").paging(1337, { // make 1337 elements navigatable
	format: '[< ncnnn! >]', // define how the navigation should look like and in which order onFormat() get's called
	perpage: 10, // show 10 elements per page
	lapping: 0, // don't overlap pages for the moment
	page: 1, // start at page, can also be "null" or negative
	onSelect: function (page) {
		// add code which gets executed when user selects a page, how about $.ajax() or $(...).slice()?
		console.log(this);
	},
	onFormat: function (type) {
		switch (type) {
		case 'block': // n and c
			return '<a href="#">' + this.value + '</a>';
		case 'next': // >
			return '<a href="#">&gt;</a>';
		case 'prev': // <
			return '<a href="#">&lt;</a>';
		case 'first': // [
			return '<a href="#">first</a>';
		case 'last': // ]
			return '<a href="#">last</a>';
		}
	}
});
```

The strength of the library is that every parameter you would need is pre calculated and accessable via the "this"-object inside the callbacks.

Build
=====
The library is aggressively size optimized and works best with Closure-Compiler Advanced mode.



Ajax Select Callback
====================
```javascript
function onSelectCB(page) {

	$.ajax({
		"url": '/data.php?start=' + this.slice[0] + '&end=' + this.slice[1] + '&page=' + page,
		"success": function(data) {
			// content replace
		}
	});
}
```

Slice Select Callback
======================
function onSelectCB(page) {

	var data = this.slice;
	
	content.slice(prev[0], prev[1]).css('display', 'none');
	content.slice(data[0], data[1]).css('display', 'block');
	
	prev = data;
}

Using cookies
=============
```javascript
$(".pagination").paging(1337, {
	format: '[< ncnnn! >]',
	perpage: 10,
	page: getCookie("current") || 1,
	onSelect: function (page) {
		setCookie("current", page)
		console.log(this);
	},
	onFormat: onFormatCB
});
```


Further examples and documentation
==========================
For further details and code examples take a look at the demonstration and documentation page on:

http://www.xarg.org/2011/09/jquery-pagination-revised/

License
======
Dual licensed under the MIT or GPL Version 2 licenses.