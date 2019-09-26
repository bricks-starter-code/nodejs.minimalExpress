var http = require('http'),
    httpProxy = require('http-proxy');
 
//
// From: https://www.npmjs.com/package/http-proxy
//
var proxy = httpProxy.createProxyServer({});
 


 
var server = http.createServer(function(req, res) {
  console.log("Proxying");
  proxy.web(req, res, {
    target: 'http://127.0.0.1:9000'
  });
});
 
console.log("listening on port 8000")
server.listen(8000);
 
//
// Create your target server
//
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9000);
