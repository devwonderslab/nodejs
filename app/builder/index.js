var fs = require('fs');
var toGlobal = require( __dirname + '/../../helpers/toGlobal');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var html = require( __dirname + '/../../helpers/html');
var express = require('express');

module.exports = function( router, app, config, callback  ) {

    mongoose.connect( config.db );

    app.use( bodyParser.json() );
    app.use( express.static( config.path.public ) );
    app.set( 'views', config.path.public );
    app.engine( 'ehtml', html );
    app.set( 'view engine', 'ehtml' );

    toGlobal( 'models', config.path.models );
    toGlobal( 'middleware', config.path.middleware );

    app.use(global.middleware._cors);
    app.use(global.middleware.auth);

    var routes = fs.readdirSync( config.path.controllers );

    routes.map( function( file, index ) {
        var name = file.replace( '.js', '' );
        if ( name === config.mainRoute ) {
            name = '';
        }
        router = require( config.path.controllers + '/' + file ) ( '/' + name, router, config );
        app.use( router );
        if ( index === routes.length - 1 ) {
            callback();
        }
    });

};
