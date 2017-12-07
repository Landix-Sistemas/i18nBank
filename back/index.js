var http = require('http');
http.createServer(function(req,res) {

  res.writeHead(200, { 
		'Content-Type': 'text/plain; charset=utf-8', 
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
		'Access-Control-Allow-Headers': 'Content-Type'
	});
	var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');
	var language_translator = new LanguageTranslatorV2({
	  username: '189e9255-1e52-42b8-8eb7-88e355ee0aff',
	  password: 'oPEfzKgcXdWF',
	  url: 'https://gateway.watsonplatform.net/language-translator/api'
	});
	language_translator.translate({
	  text: require('url').parse(req.url, true).query.texto, source : require('url').parse(req.url, true).query.source, target: require('url').parse(req.url, true).query.target },
	  function (err, translation) {
		if (err)
		  res.end('error:', err);
		else{
		  res.end(JSON.stringify(translation, null, 2));
		  console.log(translation);
		}
	});
	
}).listen(3100);
console.log('Servidor iniciado em localhost:3100. Ctrl+C para encerrar…');