/**
 * @license jQuery paging plugin v1.1.1 21/06/2014
 * http://www.xarg.org/2011/09/jquery-pagination-revised/
 *
 * Copyright (c) 2011, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

(function($) {

    $["fn"]["easyPaging"] = function(num, o) {

        if (!$["fn"]["paging"]) {
            return this;
        }

        // Normal Paging config
        var opts = {
            "perpage": 10,
            "elements": 0,
            "page": 1,
            "format": "",
            "lapping": 0,
            "onSelect": function() {
            }
        };

        $["extend"](opts, o || {});

        var $li = $("li", this);

        var masks = {};

        $li.each(function(i) {

            if (0 === i) {
                masks.prev = this.innerHTML;
                opts.format += "<";
            } else if (i + 1 === $li.length) {
                masks.next = this.innerHTML;
                opts.format += ">";
            } else {
                masks[i] = this.innerHTML.replace(/#[nc]/, function(str) {
                    opts["format"] += str.replace("#", "");
                    return "([...])";
                });
            }
        });

        opts["onFormat"] = function(type) {

            var value = "";

            switch (type) {
                case 'block':

                    value = masks[this["pos"]].replace("([...])", this["value"]);

                    if (!this['active'])
                        return '<li>' + value + '</li>';
                    if (this["page"] !== this["value"])
                        return '<li><a href="#' + this["value"] + '">' + value + '</a></li>';
                    return '<li class="current">' + value + '</li>';

                case 'next':
                case 'prev':
                    if (!this['active'])
                        return '<li>' + masks[type] + '</li>';
                    return '<li><a href="#' + this["value"] + '">' + masks[type] + '</a></li>';
            }
        };

        $(this)["paging"](num, opts);
        
        return this;
    };

}(jQuery));
