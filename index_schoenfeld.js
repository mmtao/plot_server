var svg = require('./schoenfeld.js');

var getSvgString = function() {

    var svgString = "";
    svgString = svgString.concat('<?xml version="1.0" encoding="utf-8"?>');
    svgString = svgString.concat('<?xml-stylesheet type="text/css" href="schoenfeld.css" ?>');
    svgString = svgString.concat('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
    svgString = svgString.concat(svg.node().outerHTML);


    /*
     // output the entire <svg> element
     console.log('<?xml version="1.0" encoding="utf-8"?>');
     console.log('<?xml-stylesheet type="text/css" href="schoenfeld.css" ?>');
     console.log('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
     console.log(svg.node().outerHTML);
     */

    return svgString;
};
module.exports = getSvgString;