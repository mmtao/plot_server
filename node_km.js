var propensity = require('./km.js');

module.exports = function(data) {

    var svgString = "";
    svgString = svgString.concat('<?xml version="1.0" encoding="utf-8"?>');
    svgString = svgString.concat('<?xml-stylesheet type="text/css" href="../css/km.css" ?>');
    svgString = svgString.concat('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
    var svg = propensity(data);
    svgString = svgString.concat(svg.node().outerHTML);
    return svgString;
};
