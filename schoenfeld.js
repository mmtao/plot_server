// bring in d3 if its not globaly available (e.g. browser side usage)
var d3 = d3 || require('d3');

function schoenfeld(inputdata) {

    if (typeof module !== 'undefined' && module.exports) {
        // In node
        var jsdom = require('jsdom');
        var document = jsdom.jsdom(),
            svg = d3.select(document.body).append("svg")
    }
    else {
        // In browser
        var svg = d3.select("#chartContainer")
            .append("svg")
    }

    // Reorg schoenfeld data
    var timeValues = inputdata[0].timeValues;
    var residuals = inputdata[0].residuals;

    var data = [];
    for (var i = 0; i < timeValues.length; i++) {
        data.push({
            "timeValues": timeValues[i],
            "residuals": residuals[i]
        })
        //data[timeValues[i]] = residuals[i];
    }

    // Reorg fitted line
    var xfit = inputdata[0].x;
    var yfit = inputdata[0].yfit;
    var yupper = inputdata[0].yupper;
    var ylower = inputdata[0].ylower;

    var fit_data = [];
    for (var i = 0; i < xfit.length; i++) {
        if (xfit[i] > 0) {
            fit_data.push({
                "xfit": xfit[i],
                "yfit": yfit[i],
                "yupper": yupper[i],
                "ylower": ylower[i]
            })
        }
    }
   //console.log(fit_data);
    console.log(d3.min(fit_data, function(c) { return c.xfit; }));
    console.log(d3.max(fit_data, function(c) { return c.xfit; }));

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 760 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Get scaling for the two axis (essentially how much canvas space)
    var x = d3.scale.log()
        .range([margin.left, width - margin.right]);

    var y = d3.scale.linear()
        .range([height - margin.top, margin.bottom]);

    // Calculate the domain (the raw values that will be scaled to the canvas size)
    x.domain(d3.extent(fit_data, function (d) {
        return d.xfit;
    }));

    var miny = d3.min(data, function(c) { return c.residuals; });
    var minylower = d3.min(fit_data, function(c) { return c.ylower; } );
    var maxy = d3.max(data, function(c) { return c.residuals; });
    var maxyupper = d3.max(fit_data, function(c) { return c.yupper; } );
    y.domain([
        Math.min(miny, minylower),
        Math.max(maxy, maxyupper)
    ]).nice();

    // Draw the axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5, ",.1s")
        .tickSize(6, 0);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    svg.attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.top) + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width /2 )
        .attr("y", margin.bottom)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text("Log Time");

    // Remember the text is rotated, so all of the text coordinates are off a different reference
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height /2))
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text("Scaled Schoenfeld Residual for Exposure")
    ;

    // Draws the grid lines
    svg.selectAll("line.horizonalGrid").data(y.ticks(4)).enter()
        .append("line")
        .attr(
            {
                "class":"horizontalGrid",
                "x1" : margin.left,
                "x2" : width-margin.right,
                "y1" : function(d){ return y(d);},
                "y2" : function(d){ return y(d);},
                "fill" : "none",
                "shape-rendering" : "crispEdges",
                "stroke" : "black",
                "stroke-width" : "1px",
                "opacity" : 0.3
            })
        .style("stroke-dasharray", ("3, 3"))  // <== This line here!!
    ;

    svg.append("line")
        .attr(
            {
                "x1" : margin.left,
                "x2" : width-margin.right,
                "y1" : y(0),
                "y2" : y(0),
                "fill" : "none",
                "shape-rendering" : "crispEdges",
                "stroke" : "black",
                "stroke-width" : "1px",
            })

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function (d) {
            return x(d.timeValues);
        })
        .attr("cy", function (d) {
            return y(d.residuals);
        })
        .attr("r", 3.5);


    // Fitted line
    var lineGen = d3.svg.line()
        .x(function (d) {
            return x(d.xfit);
        })
        .y(function (d) {
            return y(d.yfit);
        }).interpolate("basis");

    svg.append("path")
        .attr('class', "fit line")
        .attr('d', lineGen(fit_data))
        .attr('fill', 'none');

    // Defines an area bounded by the lower and upper lines
    var areaabove = d3.svg.area()
        .interpolate("basis")
        .x(function(d) { return x(d.xfit); })
        .y1(function(d) { return y(d.yupper); })
        .y0(function(d) { return y(d.ylower); })
        ;

    // Fill in the area
    svg.append("path")
        .attr("class", "area above")
        .attr('d', areaabove(fit_data));

    return svg;
}
// Export it
if (typeof module !== 'undefined' && module.exports) {
    module.exports = schoenfeld;
}