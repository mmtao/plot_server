// bring in d3 if its not globaly available (e.g. browser side usage)
var d3 = d3 || require('d3');

function propensity(inputdata) {
    //console.log(inputdata);
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

    var indata = inputdata[0];
    var expGroup = indata.exposureGroup;
    var xValues = indata.x;
    var yValues = indata.y;
    var xIntercept = indata.xintercept;

    // Gets the unique values in the strata
    var expGroupNames = indata.exposureGroup.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    //console.log(expGroupNames);
    var color = ["red", "blue"];

    var data = new Array(expGroupNames.length);
    for (var i=0; i<data.length; i++) {
        data[i]= [];
    }

    for (var i = 0; i < xValues.length; i++) {
        for (var j = 0; j < expGroupNames.length; j++) {
            if (expGroupNames[j] == expGroup[i]) {
                data[j].push({
                    "xValue": xValues[i],
                    "yValue": yValues[i]
                })
                break;
            }
        }

    }

    var margin = {top: 20, right: 50, bottom: 30, left: 75},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Get scaling for the two axis (essentially how much canvas space)
    var x = d3.scale.linear()
        .range([margin.left, width - margin.right]);

    var y = d3.scale.linear()
        .range([height - margin.top, margin.bottom]);

    // Calculate the domain (the raw values that will be scaled to the canvas size)
    x.domain(d3.extent(xValues));
    y.domain(d3.extent(yValues));

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
        .attr("x", ((width /2)))
        .attr("dy", "4em")
        .style("text-anchor", "start")
        .text("Propensity Score");

    // Remember the text is rotated, so all of the text coordinates are off a different reference
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height /2))
        .attr("dy", "-4em")
        .style("text-anchor", "middle")
        .text("Density of Patients")
    ;

    // Draws the grid lines
    svg.selectAll(".horizonalGrid").data(y.ticks(7)).enter()
        .append("line")
        .attr("class", "horizontalGrid")
        .attr("x1", margin.left)
        .attr("x2", width-margin.right)
        .attr("y1", function(d){ return y(d);})
        .attr("y2", function(d){ return y(d);})
    ;

    var lineGen = d3.svg.line()
        .x(function (d) {
            return x(d.xValue);
        })
        .y(function (d) {
            return y(d.yValue);
        })
        .interpolate("basis");
    var area = d3.svg.area()
        .x(function (d) {
            return x(d.xValue);
        })
        .y0(height - margin.top)
        .y1(function (d) {
            return y(d.yValue);
        })
        .interpolate("basis");

    for (var i=0; i<data.length; i++) {
        svg.append("path")
            .attr("class", "area")
            .attr("d", area(data[i]))
            .attr("fill", color[i])
        ;
    }

    // Draw intercept lines
    for (var i=0; i<xIntercept.length; i++) {
        svg.append("line")
            .attr("class", "intercept")
            .attr("x1", x(xIntercept[i]))
            .attr("x2", x(xIntercept[i]))
            .attr("y1", height - margin.top)
            .attr("y2", margin.bottom)
        ;
    }

    // Legend stuff
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - 50)+ " ," + (height - 100 )  + ")")
    
    legend.append("text")
        .attr("class", "label")
        .attr("x", "1.5em")
        .text("Exposure Group")
    ;

    for (i = 0; i < expGroupNames.length; i++) {
        legend.append("circle")
            .attr("class", "legendItem")
            .attr("cx", "2em")
            .attr("cy", (((i + 1) * 1.5) - 0.3) + "em")
            .attr("r", "0.4em")
            .attr("fill",color[i])

        legend.append("text")
            .attr("class", "legend")
            .attr("x", "3em")
            .attr("y", (i + 1) * 1.5 + "em")
            .text(expGroupNames[i]);
    }

    return svg;
}
// Export it if this is node
if (typeof module !== 'undefined' && module.exports) {
    module.exports = propensity;
}