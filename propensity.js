
// bring in d3 if its not globaly available (e.g. browser side usage)
var d3 = d3 || require('d3');

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

// TODO: move this to an external file
var data = [{
    "Client": "ABC",
    "sale": "110",
    "year": "2000"
}, {
    "Client": "ABC",
    "sale": "140",
    "year": "2001"
}, {
    "Client": "ABC",
    "sale": "180",
    "year": "2002"
}, {
    "Client": "ABC",
    "sale": "200",
    "year": "2003"
}, {
    "Client": "ABC",
    "sale": "160",
    "year": "2004"
}, {
    "Client": "ABC",
    "sale": "110",
    "year": "2006"
},

    {
        "Client": "XYZ",
        "sale": "100",
        "year": "2004"
    }, {
        "Client": "XYZ",
        "sale": "150",
        "year": "2005"
    }, {
        "Client": "XYZ",
        "sale": "200",
        "year": "2006"
    }, {
        "Client": "XYZ",
        "sale": "180",
        "year": "2007"
    }, {
        "Client": "XYZ",
        "sale": "134",
        "year": "2008"
    }, {
        "Client": "XYZ",
        "sale": "100",
        "year": "2009"
    }];

var dataGroup = d3.nest()
    .key(function(d) {return d.Client;})
    .entries(data);

// Set some attributes
svg.attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr("width", 1000)
    .attr("height", 500)
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
        top: 50,
        right: 20,
        bottom: 50,
        left: 50
    }

// The inner function is an accessor function to specify how to access the 'data' argument
function accessYear(d) {
    return d.year;
}
function accessSale(d) {
    return d.sale;
}

minyear = d3.min(data, accessYear);
maxyear = d3.max(data, accessYear);
minsale = d3.min(data, accessSale);
maxsale = d3.max(data, accessSale);

xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([minyear, maxyear]),
    yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([minsale, maxsale]),

    xAxis = d3.svg.axis()
        .scale(xScale),

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

svg.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);
svg.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(0" + (MARGINS.left) + ",0)")
    .call(yAxis);

var lineGen = d3.svg.line()
    .x(function(d) {
        return xScale(d.year);
    })
    .y(function(d) {
        return yScale(d.sale);
    })
    .interpolate("basis");


dataGroup.forEach(function(d, i) {
    svg.append('svg:path')
        .attr('d', lineGen(d.values))
        .attr('stroke',
        function(d, j) {
         return d3.hsl(Math.random() * 360,"100%","50%");
         })
            // This doesn't work on node because there is no client side processing
            /*function(d, j) {
            return "hsl(" + Math.random() * 360 + ",100%,50%)";
        })*/
        .attr('stroke-width', 2)
        .attr('fill', 'none');
    lSpace = WIDTH / dataGroup.length;

    svg.append("text")
        .attr("x", (lSpace/2) + i * lSpace)
        .attr("y", HEIGHT)
        .style("fill", "black")
        .attr("class", "legend")
        .text(d.key);

});

minyearofsecond = d3.min(dataGroup[1].values, accessYear);
maxyearoffirst = d3.max(dataGroup[0].values, accessYear);

var area = d3.svg.area()
    .x(function(d) { return xScale(d.year); })
    .y0(HEIGHT-MARGINS.bottom)
    .y1(function(d) {return yScale(d.sale); })
    .interpolate("basis");


/*
svg.append("linearGradient")
    .attr("id", "area-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "0%")
    .selectAll("stop")
    .data([
        {offset: "0%", color: "white"},
        {offset: "55%", color: "white"},
        {offset: "55%", color: "green"},
        {offset: "100%", color: "green"}
    ])
    .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });
*/

svg.append("path")
    .datum(dataGroup[0].values)
    .attr("class", "area")
    .attr("d", area)
    //            .attr("fill", "url(#area-gradient)")
    .attr("fill", "yellow")
    .attr("opacity", "0.2")
;


/*
svg.append("linearGradient")
    .attr("id", "area-gradient2")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "0%")
    .selectAll("stop")
    .data([
        {offset: "0%", color: "green", opacity: "1"},
        {offset: "55%", color: "green", opacity: "1"},
        {offset: "55%", color: "green", opacity: "0"},
        {offset: "100%", color: "green", opacity: "0"}

    ])
    .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; })
    .attr("stop-opacity", function(d) { return d.opacity; });
;
*/

svg.append("path")
    .datum(dataGroup[1].values)
    .attr("class", "area")
    .attr("d", area)
    //            .attr("fill", "url(#area-gradient2)");
    .attr("fill", "red")
    .attr("opacity", "0.2")
;

// Export it if this is node
if (typeof module !== 'undefined' && module.exports) {
    module.exports = svg;
}