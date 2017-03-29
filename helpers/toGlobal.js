var fs = require('fs');
module.exports = function ( name, dir ) {
    var data = fs.readdirSync( dir );
    global [ name ] = {};
    data.map( function( file ) {
        var path = file.replace( '.js', '' );
        global [ name ][ path ] = require( dir + '/' + file );
    });
};
