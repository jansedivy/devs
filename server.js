var http = require('http');
var Static = require('node-static');
var chalk = require('chalk');

var fileServer = new Static.Server(process.cwd());

module.exports = {
  start: function(port, bundle, outputFile) {
    port = port || 8000;

    var app = http.createServer(function(req, res) {
      var start = Date.now();

      var log = function() {
        console.log(chalk.yellow(req.method) + ' ' + chalk.green(res.statusCode) + ' ' + req.url + ' ' + chalk.cyan((Date.now() - start) + 'ms'));
      };

      if (bundle && req.url === '/' + outputFile) {
        res.statusCode = 200;

        bundle.bundle(function(err, data) {
          if (err) {
            return res.end('document.body.innerHTML = \'' + err.toString() + '\'');
          }

          log();
          res.setHeader('Content-Type', 'application/javascript');
          res.end(data);
        });
        return;
      }

      fileServer.serve(req, res, function() {
        log();
      });
    });

    app.listen(port, function() {
      console.log('Starting dev server on localhost:' + port);
    });
  }
};
