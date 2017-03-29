var envs = [
    "dev",
    "test",
    "live"
];
var options = require( './options' );
var env;
process.argv.filter( function ( v ) {
    if( v.match( '--env=' ) ) {
        env = v.split( '=' )[ 1 ];
    }
});
env = envs.indexOf( env ) < 0 ? "dev" : env;
var dotenv = require( 'dotenv' ).config( { path: __dirname + '/environments/' + env + '/.env' } );
for ( var x in dotenv ) {
    options[ x ] = dotenv[ x ];
}
module.exports = options;