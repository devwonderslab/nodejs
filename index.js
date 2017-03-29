var express = require( 'express' );

var app = express();
var router = express.Router();
var http = require( 'http' );

var config = require( './config' );

require( './app/builder' ) ( router, app, config, function() {
    http.createServer( app ).listen( config.port );
    console.log( '===| SERVER IS RUNNING AT ' + config.port + ' port |===' );
});