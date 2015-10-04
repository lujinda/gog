var express = require('express');
var init = require('./init');
var app = express();
var proxy = require('./proxy');
var config = require('./config').website;
var hbs = require('hbs');
var cookie_parser = require('cookie-parser');
var body_parser = require('body-parser');

app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

app.engine('html', hbs.__express);

app.use(cookie_parser());
app.use(body_parser());
app.use(init);
app.use('/static/', express.static('static'));


app.get('/', function(req, res){
    res.setHeader('Cache-Control', 'max-age=604800');
    res.render('index');
});

app.get('/webhp', function(req, res){
    res.setHeader('Cache-Control', 'max-age=604800');
    res.render('index');
});

app.get('/*', proxy.handler);

var port = process.env.VCAP_APP_PORT || config.port;
app.listen(port, config.host);
console.log('Server listen %s:%s', config.host, port);

