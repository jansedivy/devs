var http = require('http');
var st = require('st');

module.exports = {
  start: function(bundle, outputFile) {
    var mount = st({
      path: process.cwd(),
      cache: false,
      index: 'index.html'
    });

    var app = http.createServer(function(req, res) {
      console.log(req.method + ' ' + req.url);

      if (req.url === '/' + outputFile) {
        res.statusCode = 200;

        bundle.bundle(function(err, data) {
          if (err) {
            return res.end('document.body.innerHTML = \'' + err.toString() + '\'');
          }

          res.setHeader('Content-Type', 'application/javascript');
          res.end(data);
        });
        return;
      }

      mount(req, res);
    });

    app.listen(8000, function() {
      console.log('Starting dev server on localhost:8000');
    });
  }
};
