# plot_server

Two ways of obtaining the plots

1) Client side: point your browser to index_foo.html where foo is the plot that you want.

2) Server side: 

Run in one terminal: node chart_node_server.js
Run in second terminal: curl -X POST -d @data/foo_payload.js -H "Content-Type: application/json" localhost:9595

This should generate an svg in output/ directory.  This will need to be converted to a PNG in order to be viewed.

Note that the same css/ is used by either of the two methods.
