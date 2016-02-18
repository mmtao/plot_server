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

//console.log(data);

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.log()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left").ticks(10);

    /*
     var svg = d3.select("body").append("svg")
     */
    svg.attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g");
    /*
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     */

    x.domain(d3.extent(data, function (d) {
        return d.timeValues;
    })).nice();
    y.domain(d3.extent(data, function (d) {
        return d.residuals;
    })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Log Time");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")


        .attr("y", 10)

        /*
         .attr("y", 6)
         .attr("dy", ".71em")
         */
        .style("text-anchor", "end")
        .text("Scaled Schoenfeld Residual for Exposure")

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function (d) {
            return x(d.timeValues);
        })
        .attr("cy", function (d) {
            return y(d.residuals);
        })
        .style("fill", function (d) {
            return "black";
        });

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        });

    return svg;
}
// Export it
if (typeof module !== 'undefined' && module.exports) {
    module.exports = schoenfeld;
}