var http = require('http');
var Static = require('node-static');
var chalk = require('chalk');
var sweetify = require('sweetify');

var to5ify = require('6to5ify');

var fileServer = new Static.Server(process.cwd(), { cache: 0 });

var log = function(status, req) {
  var statusColor = status === 404 ? chalk.red : chalk.green;

  console.log(chalk.yellow(req.method) + ' ' + (statusColor(status)) + ' ' + req.url);
};

var serverBrowserify = function(bundle, outputFile, req, res) {
  if (bundle && req.url === '/' + outputFile) {
    res.statusCode = 200;

    bundle
      .transform(to5ify)
      .bundle(function(err, data) {
        if (err) {
          return res.end('document.body.innerHTML = \'' + err.toString() + '\'');
        }

        log(res.statusCode, req);
        res.setHeader('Content-Type', 'application/javascript');
        res.end(data);
      });
    return true;
  }
};


module.exports = {
  start: function(port, bundle, outputFile) {
    port = port || 8000;
    outputFile = outputFile || 'bundle.js';

    var app = http.createServer(function(req, res) {
      if (serverBrowserify(bundle, outputFile, req, res)) {
        return;
      }

      fileServer.serve(req, res, function(err, e) {
        if (err) {
          console.error("> Error serving " + req.url + " - " + err.message);
          res.writeHead(err.status, err.headers);
          res.end();
        } else {
          var status = e ? e.status : 404;
          log(status, req);
        }
      });
    });

    app.listen(port, function() {
      console.log('Starting dev server on localhost:' + port);
    });
  }
};
