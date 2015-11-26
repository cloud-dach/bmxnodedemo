var express = require('express');
var multer= require('multer');
var autoreap= require('multer-autoreap');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(autoreap);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({dest: 'images/'}));


var request = require('request');





app.use('/', routes);
app.use('/users', users);

app.post('/addbook', function(req,res) {
	console.log(req.body.name);
	console.log(req.files);	
	var recipetitle=req.body.name;
	var ingredients=req.body.ingredients;
	var recipe=req.body.rezept;
	var image=req.files.bildpfad.path;
	var data=fs.readFileSync(image);
	var uristring = new Buffer(data).toString('base64');
	var base64uri='data:image/jpeg;base64,';	
	base64uri+=uristring;

	var newreciperecord={'recipetitle':recipetitle, 'ingredients':ingredients, 'recipe':recipe, 'img':base64uri};
	if (!err) {
			console.log('name: ' + req.param('name') + req.param('ingredients') + req.param('rezept'));
			res.render('confirm', { title: 'Eingabebestätigung' });	
		} else {
			res.render('dberror', { title: 'Datenbankfehler' });
		}	
	
	
});
// der folgende Code ist auskommentiert weil er es nicht tut. mit app.post bekomm ich einen 404 Fehler mit app.get, bekomm ich die Seite angezeigt, aber kann sie nicht verarbeiten.
// app.post('/e', function(req,res) {
//	console.log(req.query.id);
//	db.get(req.query.id, function(err,body){
//	if (!err){
//		res.render('rezeptedit', {title : 'Rezeptedit', doc : body });	
//	}
//	});
//	console.log(req.body);
// });

// Even though I get something back from my Calls to the API and it looks like JSON, it isn't so with JSON.parse, the string that I have is magically 
// transfered into JSON which I can perfectly iterate through in Jade.

app.get('/rmbooks', function(req,res) {
	var booklist={};
	var list="//";
	request('http://java-swagger-rm-123.eu-gb.mybluemix.net/rest/books', function (error, response, body) {
    	if (!error && response.statusCode == 200) {
		jsonobj=JSON.parse(body);
        	console.log(jsonobj) // Print the return
		res.render('rmbooks', { title : 'Rene\'s Booklist', list : jsonobj });
   	}
	})
	
	
});

app.get ('/p', function(req,res) {
	console.log(req.query.id);
	var bookrequest="http://java-swagger-rm-123.eu-gb.mybluemix.net/rest/books/"+req.query.id;
	console.log(bookrequest);
	request(bookrequest, function (error, response, body) {
	bookobj=JSON.parse(body);
	console.log(bookobj);
	// if (!err){
		res.render('bookdetails', {title : 'Bookdetail', doc : bookobj });	
	// };
	})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
app.listen(port, host);
console.log('App started on port ' + port);;
module.exports = app;
