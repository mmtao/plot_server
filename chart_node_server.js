// pre-render d3 charts at server side
var d3 = require('./node_modules/d3/d3.js')
    , jsdom = require('jsdom')
    , fs = require('fs')
    , http = require('http')
    , url = require('url')
    , queryString = require('querystring')
    , htmlStub = '<html><head></head><body><div id="dataviz-container"></div><script src="js/d3.v3.min.js"></script></body></html>'

/*
var XMLHttpReq = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpReq();
*/

var port = 9595;

jsdomsvg = function(chartId, type, payload) {

    jsdom.env({
        features: {QuerySelector: true}
        , html: htmlStub
        , done: function (errors, window) {
            console.log(type);
            console.log(payload);

            var el = window.document.querySelector('#dataviz-container')
                , body = window.document.querySelector('body')

/*
            // generate the dataviz
            var svgSelection = d3.select(el)
                .append('svg:svg')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .attr('width', payload.x)
                .attr('height', payload.y)
                .attr('id', chartId) // say, this value was dynamically retrieved from some database
*/

            if ('circle' == type) {
/*
                svgSelection
                    .append('circle')
                    .attr('cx', 300)
                    .attr('cy', 150)
                    .attr('r', 30)
                    .attr('fill', '#26963c')
                    console.log("drawing a circle!");
*/
            }
            if ('bar' == type) {
                svgSelection
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', 300)
                    .attr('height', 500)
                    .attr('fill', '#26963c')
                console.log("drawing a rect!");
            }
            // make the client-side script manipulate the circle at client side)
            var clientScript = "d3.select('#" + chartId + "').transition().delay(1000).attr('fill', '#f9af26')"

            d3.select(body)
                .append('script')
                .html(clientScript)

            var document = window.document
            // save result in an html file, we could also keep it in memory, or export the interesting fragment into a database for later use
            var svgcontainer = window.document.querySelector("#dataviz-container")
            var svginner = svgcontainer.innerHTML

            fs.writeFile('id_' + chartId + '.svg', svginner, function (err) {
                if (err) {
                    console.log('error saving document', err)
                } else {
                    console.log('The file was saved!')
                }
            })

        }
    })
}

var count = 0;
var server = http.createServer(function (request, response) {

    count = count + 1;

    if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post = queryString.parse(body);
            var myJson = JSON.parse(body);
            console.log(myJson);
            jsdomsvg(count, myJson.type, myJson.data);
        });
    }
    response.writeHead(200, {
        'Content-Type': 'text/html'
    })
    response.write('generated id is:' + count);
    response.write('\n');
    response.end();

});

server.listen(port);

if (server) {
    console.log('Web server running on port ' + port);
}

