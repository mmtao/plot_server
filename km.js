// bring in d3 if its not globaly available (e.g. browser side usage)
var d3 = d3 || require('d3');

function km(inputdata) {

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

    // Reorg km data
    var indata = inputdata[0];
    var timeValues = indata.timeValues;
    var survival = indata.survivalEstimate;
    var strata = indata.strata;
    var upperbound = indata.confIntUpperBound;
    var lowerbound = indata.confIntLowerBound;

    // Gets the unique values in the strata
    var strataNames = strata.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    console.log(strataNames);
    var color = ["blue", "red", "yellow"];

    var data = new Array(strataNames.length);
    for (var i=0; i<data.length; i++) {
        data[i]= [];
    }

    for (var i = 0; i < timeValues.length; i++) {
        for (var j = 0; j < strataNames.length; j++) {
            if (strataNames[j] == strata[i]) {
                data[j].push({
                    "timeValues": timeValues[i],
                    "survival": survival[i],
                    "upperbound": upperbound[i],
                    "lowerbound": lowerbound[i]
                })
                break;
            }
        }

    }
    // TODO: add some error checking

    var margin = {top: 20, right: 20, bottom: 30, left: 100},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Get scaling for the two axis (essentially how much canvas space)
    var x = d3.scale.linear()
        .range([margin.left, width - margin.right]);

    var y = d3.scale.linear()
        .range([height - margin.top, margin.bottom]);

    // Calculate the domain (the raw values that will be scaled to the canvas size)
    x.domain(d3.extent(timeValues));
    var miny = d3.min(lowerbound);
    var maxy = d3.max(upperbound);
    y.domain([0, maxy]);

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
        .text("Time (days)");

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
        .text("Survival Probability")
    ;

    // Draws the grid lines
    svg.selectAll(".horizonalGrid").data(y.ticks(4)).enter()
        .append("line")
        .attr("class", "horizontalGrid")
        .attr("x1", margin.left)
        .attr("x2", width-margin.right)
        .attr("y1", function(d){ return y(d);})
        .attr("y2", function(d){ return y(d);})
    ;
    svg.selectAll(".verticalGrid").data(x.ticks(4)).enter()
        .append("line")
        .attr("class", "verticalGrid")
        .attr("x1", function(d){ return x(d);})
        .attr("x2", function(d){ return x(d);})
        .attr("y1", height - margin.top)
        .attr("y2", margin.bottom)
    ;

    var lineGen = d3.svg.line()
        .x(function (d) {
            return x(d.timeValues);
        })
        .y(function (d) {
            return y(d.survival);
        }).interpolate("step-after");

    var confidenceArea = d3.svg.area()
        .interpolate("step-after")
        .x(function(d) { return x(d.timeValues); })
        .y1(function(d) { return y(d.upperbound); })
        .y0(function(d) { return y(d.lowerbound); })
        ;

    for (var i=0; i<data.length; i++) {
       // console.log("drawing" + data[i]);
        svg.append("path")
            .attr('class', "exp"+i)
            .attr('d', lineGen(data[i]))
            .attr('fill', 'none')
            .attr('stroke', color[i])
        svg.append("path")
            .attr("class", "confidence"+i)
            .attr("d", confidenceArea(data[i]));
    }

    // Legend stuff

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(150," + (height - 100 )  + ")")

    var maxStrataName = d3.max(strataNames, function(d) { return d.length;});
    legend.append("rect")
        .attr("width", maxStrataName + 3+"em")
        .attr("height", strataNames.length * 2+ "em")
        .style("stroke", "black")

    for (i = 0; i < strataNames.length; i++) {
        legend.append("circle")
            .attr("class", "legendItem0")
            .attr("cx", "2em")
            .attr("cy", (((i + 1) * 1.5) - 0.3) + "em")
            .attr("r", "0.4em")
            .attr("fill",color[i])

        legend.append("text")
            .attr("class", "legendline")
            .attr("x", "3em")
            .attr("y", (i + 1) * 1.5 + "em")

            .text(strataNames[i]);
    }
    return svg;
}
// Export it
if (typeof module !== 'undefined' && module.exports) {
    module.exports = km;
}