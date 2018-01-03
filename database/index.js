var port    = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 3000;
var express = require('express');
var Gun     = require('gun');

var app    = express();
app.use(Gun.serve);
app.use(express.static(__dirname));

var server = app.listen(port);
Gun({	file: 'data.json', web: server });

console.log('Server started on port ' + port + ' with /gun');