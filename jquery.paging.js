/**
 * @license jQuery paging plugin v1.0.1 09/04/2011
 * http://www.xarg.org/project/jquery-color-plugin-xcolor/
 *
 * Copyright (c) 2011, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

(function($, window, undefined) {


	$["fn"]["paging"] = function(number, opts) {

		var self = this,
		  Paging = {

			"setOptions": function(opts) {

				function parseFormat(format) {

					var gndx = 0, group = 0, num = 1, res = {
						fstack:         [], // format stack
						asterisk:       0, // asterisk?
						inactive:       0, // fill empty pages with inactives up to w?
						blockwide:      5, // width of number block
						current:        3, // position of current element in number block
						rights:         0, // num of rights
						lefts:          0 // num of lefts
					}, tok, pattern = /[*<>pq\[\]().-]|[nc]+!?/g;

					var known = {
						"[": "first",
						"]": "last",
						"<": "prev",
						">": "next",
						"q": "left",
						"p": "right",
						"-": "fill",
						".": "leap"
					}, count = {};

					while ((tok = pattern["exec"](format))) {

						tok = ("" + tok);

						if (undefined === known[tok]) {

							if ("(" === tok) {
								group = ++gndx;
							} else if (")" === tok) {
								group = 0;
							} else if (num) {

								if ("*" === tok) {
									res.asterisk = 1;
									res.inactive = 0;
								} else {
									// number block is the only thing left here
									res.asterisk = 0;
									res.inactive = "!" === tok.charAt(tok.length - 1);
									res.blockwide = tok["length"] - res.inactive;
									if (!(res.current = 1 + tok.indexOf("c"))) {
										res.current = (1 + res.blockwide) >> 1;
									}
								}

								res.fstack[res.fstack.length] = ({
									ftype: "block",	// type
									group: 0,		// group
									pos: 0			// pos
								});
								num = 0;
							}

						} else {

							res.fstack[res.fstack.length] = ({
								ftype: known[tok], // type
								group: group,      // group
								pos: undefined === count[tok] ? count[tok] = 1 : ++count[tok] // pos
							});

							if ("q" === tok)
								++res.lefts;
							else if ("p" === tok)
								++res.rights;
						}
					}
					return res;
				}

				this.opts = $.extend(this.opts || {
					"lapping"		: 0,	// number of elements overlap
					"perpage"		: 10,	// number of elements per page
					"page"			: 1,	// current page
					"refresh"		: {
						"interval": 10,
						"url": null
					},	// refresh callback information

					"format"		: "",	// visual format string

					"onFormat"		: function (type) {	// callback for every format element

					/** EXAMPLE **

						switch (type) {

							case 'block':

								if (!this.active)
									return '<span class="disabled">' + this.value + '</span>';
								else if (this.value != this.page)
									return '<em><a href="#' + this.value + '">' + this.value + '</a></em>';
								return '<span class="current">' + this.value + '</span>';

							case 'right':
							case 'left':

								if (!this.active) {
									return "";
								}
								return '<a href="#' + this.value + '">' + this.value + '</a>';

							case 'next':

								if (this.active) {
									return '<a href="#' + this.value + '" class="next">Next &raquo;</a>';
								}
								return '<span class="disabled">Next &raquo;</span>';

							case 'prev':

								if (this.active) {
									return '<a href="#' + this.value + '" class="prev">&laquo; Previous</a>';
								}
								return '<span class="disabled">&laquo; Previous</span>';

							case 'first':

								if (this.active) {
									return '<a href="#' + this.value + '" class="first">|&lt;</a>';
								}
								return '<span class="disabled">|&lt;</span>';

							case 'last':

								if (this.active) {
									return '<a href="#' + this.value + '" class="prev">&gt;|</a>';
								}
								return '<span class="disabled">&gt;|</span>';

							case 'fill':
								if (this.active) {
									return "...";
								}
						}
						return ""; // return nothing for missing branches

						**/
					},
					"onSelect"		: function (page){	// callback for page selection

						/** EXAMPLE SLICE **

						var data = this.slice;

						content.slice(prev[0], prev[1]).css('display', 'none');
						content.slice(data[0], data[1]).css('display', 'block');

						prev = data;

						**/


						/** EXAMPLE AJAX **

						$.ajax({
							"url": '/data.php?start=' + this.slice[0] + '&end=' + this.slice[1] + '&page=' + page,
							"success": function(data) {
								// content replace
							}
						});

					   **/

						// Return code indicates if the link of the clicked format element should be followed (otherwise only the click-event is used)
						return true;
					},
					"onRefresh"		: function (json) {// callback for new data of refresh api

					/** EXAMPLE **
						if (json.number) {
							Paging.setNumber(json.number);
						}

						if (json.options) {
							Paging.setOptions(json.options);
						}

						Paging.setPage(); // Call with empty params to reload the paginator
						**/
					}
				}, opts || {});

				// If the number of elements per page is less then 1, set it to default
				if (this.opts["perpage"] < 1) {
					this.opts["perpage"] = 10;
				}

				if (this.interval) window.clearInterval(this.interval);

				if (this.opts["refresh"]["url"]) {

					this.interval = window.setInterval(function(o, $) {

						$["ajax"]({
							"url": o.opts["refresh"]["url"],
							"success": function(data) {
								if (typeof(data) == "object") {
									var tmp = data;
								} else {
									try {
										var tmp = $["parseJSON"](data);
									} catch (o) {
										return;
									}
								}
								o.opts["onRefresh"](tmp);
							}
						});

					}, 1000 * this.opts["refresh"]["interval"], this, $);
				}

				this.format = parseFormat(this.opts["format"]);
				return this;
			},

			"setNumber": function(number) {
				this.number = (undefined === number || number < 0) ? -1 : number;
				return this;
			},

			"setPage": function(page) {

				if (undefined === page) {

					if (page = this.opts["page"], null === page) {
						return this;
					}

				} else if (this.opts["page"] == page) {
					return this;
				}

				this.opts["page"] = (page|= 0);
				var number = this.number;
				var opts = this.opts;

				var rStart, rStop;

				var pages, buffer;

				var groups = 1, format = this.format;

				var data, tmp, node, lapping;

				var count = format.fstack["length"], i = count;


				// If the lapping is greater than perpage, reduce it to perpage - 1 to avoid endless loops
				if (opts["perpage"] <= opts["lapping"]) {
					opts["lapping"] = opts["perpage"] - 1;
				}

				lapping = number <= opts["lapping"] ? 0 : opts["lapping"]|0;


				// If the number is negative, the value doesn"t matter, we loop endlessly with a constant width
				if (number < 0) {

					number = -1;
					pages = -1;

					rStart = Math.max(1, page - format.current + 1 - lapping);
					rStop  = rStart + format.blockwide;

				} else {

					// Calculate the number of pages
					pages = 1 + Math.ceil((number - opts["perpage"]) / (opts["perpage"] - lapping));

					// If current page is negative, start at the end and
					// Set the current page into a valid range, includes 0, which is set to 1
					page = Math.max(1, Math.min(page < 0 ? 1 + pages + page : page, pages));

					// Do we need to print all numbers?
					if (format.asterisk) {
						rStart = 1;
						rStop  = 1 + pages;

						// Disable :first and :last for asterisk mode as we see all buttons
						format.current   = page;
						format.blockwide = pages;

					} else {

						// If no, start at the best position and stop at max width or at num of pages
						rStart = Math.max(1, Math.min(page - format.current, pages - format.blockwide) + 1);
						rStop = format.inactive ? rStart + format.blockwide : Math.min(rStart + format.blockwide, 1 + pages);
					}
				}

				while (i--) {

					tmp = 0; // default everything is visible
					node = format.fstack[i];

					switch (node.ftype) {

						case "left":
							tmp = (node.pos < rStart);
							break;
						case "right":
							tmp = (rStop <= pages - format.rights + node.pos);
							break;

						case "first":
							tmp = (format.current < page);
							break;
						case "last":
							tmp = (format.blockwide < format.current + pages - page);
							break;

						case "prev":
							tmp = (1 < page);
							break;
						case "next":
							tmp = (page < pages);
							break;
					}
					groups|= tmp << node.group; // group visible?
				}

				data = {
					"number"	: number,	// number of elements
					"lapping"	: lapping,	// overlapping
					"pages"		: pages,	// number of pages
					"perpage"	: opts["perpage"], // number of elements per page
					"page"		: page,		// current page
					"slice"		: [			// two element array with bounds of the current page selection
						(tmp = page * (opts["perpage"] - lapping) + lapping) - opts["perpage"], // Lower bound
						Math.min(tmp, number) // Upper bound
					]
				};

				buffer = $(document.createElement('div'));

				while (++i < count) {

					node = format.fstack[i];

					tmp = (groups >> node.group & 1);

					switch (node.ftype) {
						case "block":
							for (; rStart < rStop; ++rStart) {

								data["value"]      = rStart;
								data["pos"]	       = 1 + format.blockwide - rStop + rStart;

								data["active"]     = rStart <= pages || number < 0;    // true if infinity series and rStart <= pages
								data["first"]      = 1 === rStart;                      // check if it is the first page
								data["last"]       = rStart == pages && 0 < number;     // false if infinity series or rStart != pages

								tmp = document.createElement("div");
								tmp["innerHTML"] = opts["onFormat"].call(data, node.ftype); // we could use $() but this doesn't allow plain text

								$("a", tmp = $(tmp))
								.data("page", data["value"])
								.click(linkClick);

								buffer.append(tmp["contents"]());
							}
							continue;

						case "left":
							data["value"]      = /* void */
							data["pos"]	       = node.pos;
							data["active"]     = node.pos < rStart; // Don't take group-visibility into account!
							break;

						case "right":
							data["value"]      = pages - format.rights + node.pos;
							data["pos"]        = node.pos;
							data["active"]     = rStop <= data["value"]; // Don't take group-visibility into account!
							break;

						case "first":
							data["value"]      = 1;
							data["pos"]        = node.pos;
							data["active"]     = tmp && format.current < page; // Show only if the first page can not be accessed via the block
							break;

						case "last":
							data["value"]      = pages;
							data["pos"]        = node.pos;
							data["active"]     = tmp && format.blockwide < format.current + pages - page; // Show only if the first page can not be accessed via the block
							break;

						case "prev":
							data["value"]      = Math.max(1, page - 1);
							data["pos"]        = node.pos;
							data["active"]     = tmp && 1 < page;
							break;

						case "next":
							data["pos"]        = node.pos;

							if ((data["active"]	   = (number < 0))) {
								data["value"]      = 1 + page;
							} else {
								data["value"]      = Math.min(1 + page, pages)
								data["active"]     = tmp && page < pages;
							}
							break;

						case "leap":
						case "fill":
							data["pos"]        = node.pos;
							data["active"]     = tmp; // tmp is true by default and changes only for group behaviour
							buffer.append(opts["onFormat"].call(data, node.ftype));
							continue;
					}

					data["last"] = /* void */
					data["first"] = undefined;

					tmp = document.createElement("div");
					tmp["innerHTML"] = opts["onFormat"].call(data, node.ftype); // we could use $() but this doesn't allow plain text

					$("a", tmp = $(tmp))
					.data("page", data["value"])
					.click(linkClick);

					buffer.append(tmp["contents"]());
				}

				//self["empty"]();
				self["html"](buffer["contents"]());

				this.locate = opts["onSelect"].call({
					"number"	: number,
					"lapping"	: lapping,
					"pages"		: pages,
					"slice"		: data["slice"]
				}, page);
				return this;
			}
		};

		function linkClick(ev) {
			ev["preventDefault"]();

			var obj = ev["target"];

			do {

				if ('a' === obj["nodeName"].toLowerCase()) {
					break;
				}

			} while ((obj = obj["parentNode"]));

			Paging["setPage"]($.data(obj, "page"));

			if (Paging.locate) {
				window.location = obj["href"];
			}
		}

		return Paging
			["setNumber"](number)
			["setOptions"](opts)
			["setPage"]();
	}

}(jQuery, this));
