var svg = require('./propensity.js');

// output the entire <svg> element
/*
console.log('<?xml version="1.0" encoding="utf-8"?>');
console.log('<?xml-stylesheet type="text/css" href="propensity.css" ?>');
console.log('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
*/
console.log(svg.node().outerHTML);
