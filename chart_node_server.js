// pre-render d3 charts at server side
var fs = require('fs')
    , http = require('http')
    , url = require('url')
    , queryString = require('querystring')

jsdomsvg = function(chartId, type, payload) {

    if ('propensity' == type) {
        var svg_string = require('./node_propensity.js')(payload);
    }
    else if ('schoenfeld' == type) {
        var svg_string = require('./node_schoenfeld.js')(payload);
    }
    else if ('km' == type) {
        var svg_string = require('./node_km.js')(payload);
    }

    // write out the svg
    var outputdir = 'output';
    var filename = type + '_' + chartId + '.svg';
    fs.writeFile(outputdir + '/' + filename, svg_string, function(err) {
        if (err) {
            console.log("error saving document ", err);
        }
        else {
            console.log("File saved! " + filename);
        }
    })
    return {
        filename : filename,
        svg      : svg_string
    };
}

var port = 9595;
var count = 0;
var server = http.createServer(function (request, response) {

    count = count + 1;
    var result = {};

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
            //var post = queryString.parse(body);
            eval(body);
            console.log(datacontainer.type);

            //TODO: much faster if we read in as JSON instead of js
            //var myJson = JSON.parse(datacontainer);
            //console.log(myJson);
            //result = jsdomsvg(count, myJson.type, myJson.data);

            result = jsdomsvg(count, datacontainer.type, datacontainer.data);
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.write(result.svg);
            response.end();
        });
    }
});

server.listen(port);

if (server) {
    console.log('Web server running on port ' + port);
}

