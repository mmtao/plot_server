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
   console.log(fit_data);

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
        .attr("fill-opacity", 0);
/*        .style("fill", function (d) {
            return "black";
        });*/



    // Fitted line
    var lineGen = d3.svg.line()
        .x(function (d) {
            return x(d.xfit);
        })
        .y(function (d) {
            return y(d.yfit);
        }).interpolate("basis");

    svg.append("path")
        .attr('d', lineGen(fit_data))
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    var lineGenUpper = d3.svg.line()
        .x(function (d) {
            return x(d.xfit);
        })
        .y(function (d) {
            return y(d.yupper);
        }).interpolate("basis");

    var lineGenLower = d3.svg.line()
        .x(function (d) {
            return x(d.xfit);
        })
        .y(function (d) {
            return y(d.ylower);
        }).interpolate("basis");

/*
     svg.append("path")
         .attr('d', lineGenUpper(fit_data))
         .attr('stroke', 'gray')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
*/

/*
    svg.append("path")
        .attr('d', lineGenLower(fit_data))
        .attr('stroke', 'gray')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
*/

/*
    var area = d3.svg.area()
        .interpolate("basis")
        .x(function(d) { return x(d.xfit); })
        .y1(function(d) { return y(d.yupper); })
        .y0(function(d) { return height; })
        ;
*/

    var areabelow = d3.svg.area()
        .interpolate("basis")
        .x(function(d) { return x(d.xfit); })
        .y1(function(d) { return y(d.yupper); })
        .y0(function(d) { return 0; })
        ;

    //console.log(fit_data);
    svg.append("clipPath")
        .attr("id", "clip-below")
        .append("path")
        .datum(fit_data)
        .attr("d", areabelow);

/*
    svg.append("clipPath")
        .attr("id", "clip-above")
        .append("path")
        .datum(fit_data)
        .attr("d", area);
*/

/*
    svg.append("path")
        .attr("class", "area above")
        .attr("clip-path", "url(#clip-above)")
        .attr("d", area.y0(function(d) { return y(d.yupper); }));
*/

    svg.append("path")
        .attr("class", "area below")
//        .data(fit_data)
        .attr('d', lineGenUpper(fit_data))
        .attr("d", areabelow)
        .attr("clip-path", "url(#clip-below)")
/*
       .attr("fill", "lightgrey")
        .attr("opacity", '0.9')
*/
    ;

    /*
        svg.append("path")
            //.datum(fit_data)
            .attr("class", "area below")
            .attr('d', lineGenUpper(fit_data))

            //        .attr("clip-path", "url(#clip-below)")
            .attr("d", area)
            .attr("fill", "yellow")
            .attr("opacity", '0.2')
        ;
    */


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