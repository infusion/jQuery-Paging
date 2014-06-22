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

The strength of the library is that every parameter you would need is pre calculated and accessable via the "this"-object inside the callbacks. The most important part is the nncnn-block.


Format
======
The "format"-parameter defines how the layout should look like. The string is processed character by character from left to right. For each character, the onFormat-callback is called and a final output string is generated and applied to the selected container.

n = number
c = current

A string "nncnn!" handles several definitions at once: How many digits to show? 5 by the length of the block. Where to show the currrent page in the set? Always at the beginning? "cnnnn". Always at the end? "nnc". Always in the middle? "nncnn". The exclamation mark in the initial example means that always 5 digits will be printed. All inactive elements have a "this.active" set to false.

Additionally, there are other format-tokens like "<" and ">" for prev and next, "[" and "]" for first and last, "." and "-" for simple text replacements and "q" and "p" in order to build previous and next-blocks. A more of examples can be found on my blog (link below).


Build your own paginator!
=================
jQuery paging is just a small framework. You can use it as the calculation base of your own paginator. In the file *easy-paging.html* you'll find a small example plugin, which uses jQuery Paging to make a typical HTML based paginator work:
```
<ol id="paging">
	<li>Prev</li>
	<li>Page #n</li>
	<li>Page #n</li>
	<li>Page #c</li> <!-- current element will be here -->
	<li>Page #n</li>
	<li>Page #n</li>
	<li>Page #n</li>
	<li>Page #n</li>
	<li>Next</li>
</ol>
```

```javascript
$("#paging").easyPaging(1000, {
    onSelect: function(page) {
        console.log("You are on page " + page + " and you will select elements "+(this.slice[0]+1) + "-" + this.slice[1]+"!!!");
    }
});
```


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
```javascript
function onSelectCB(page) {

	var data = this.slice;
	
	content.slice(prev[0], prev[1]).css('display', 'none');
	content.slice(data[0], data[1]).css('display', 'block');
	
	prev = data;
}
```

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

Lock the pager
============
It's sometimes necessary to lock the pagination, because you want to disable the navigation. You can use setOptions to disable the navigation like this:
```javascript
var paging = $(".pagination").paging(1337, {
	format: '[< ncnnn! >]',
	onSelect: function (page) {

                // onSelect is called for locked pagers as well, but nothing happens, except this:
                if (page === 0) {
                    console.log("Pager was clicked, while it is disabled!");
                    return;
                }
                // ... rest
	},
	onFormat: onFormatCB
});

// Lock the pager
paging.setOptions({lock: true});

// Unlock the pager
paging.setOptions({lock: false});

```


Further examples and documentation
==========================
For further details and code examples take a look at the demonstration and documentation page on:

http://www.xarg.org/2011/09/jquery-pagination-revised/

Build
=====
The library is aggressively size optimized and works best with Closure-Compiler Advanced mode.


License
======
Dual licensed under the MIT or GPL Version 2 licenses.
