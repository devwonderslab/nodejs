var md5 = require('md5');

var mw = global.middleware;
var User = global.models.User;

module.exports = function( path, router, config ) {

    router
        .get( path, function( req, res ) {

            var page = parseInt( req.query.page ) ? parseInt( req.query.page ) : 1;
            var perPage = parseInt( req.query.perPage ) ? parseInt( req.query.perPage ) : 10;

            User
                .find()
                .skip( perPage*( page - 1 ) )
                .limit( perPage )
                .exec( function ( err, users ) {
                    if ( err ) {
                        throw err;
                    }
                    var total_pages = Math.ceil( users.length / perPage );
                    res.set( 'X-Pagination-Current-Page', page );
                    res.set( 'X-Pagination-Per-Page', perPage );
                    res.set( 'X-Pagination-Total-Pages', total_pages );
                    res.set( 'X-Pagination-Total-Entries', users.length );
                    res
                        .status( 200 )
                        .json({
                            code: 200,
                            status: 'OK',
                            message: 'Success',
                            result: users
                        });
                });
        })

        .post( path, function( req, res ) {
            if ( req.body.password ) {
                req.body.password = md5( req.body.password );
            }
            User.create( req.body, function( error, user ) {
               if ( error ) {
                   res
                       .status( 400 )
                       .json({
                           code: 400,
                           status: 'Bad request',
                           message: 'Error',
                           result: [ error ]
                       });
               } else {
                   res
                       .status( 201 )
                       .json({
                           code: 201,
                           status: 'Created',
                           message: 'Success',
                           result: [ user ]
                       });
               }
            });
        })

        .get( path + '/:id',mw.isAuth, mw.isMongoId, function( req, res ) {
            User.find ( { _id: req.params.id }, function( error, users ) {
                if ( error ) {
                    throw error;
                }
                if ( !! users.length ) {
                    res
                        .status( 200 )
                        .json({
                            code: 200,
                            status: 'OK',
                            message: 'Success',
                            result: users
                        });
                } else {
                    res
                        .status( 404 )
                        .json({
                            code: 404,
                            status: 'No found',
                            message: 'User was not found',
                            result: []
                        });
                }
            })

        })

        .put( path + '/:id', mw.isAuth, mw.isMongoId, mw.isMe, function( req, res ) {
            if ( req.body.password ) {
                req.body.password = md5( req.body.password );
            }
            User.update( { _id: req.params.id }, req.body, function( error, result ) {
                if ( error ) {
                    throw error;
                }
                res
                    .status( 202 )
                    .json({
                        code: 202,
                        status: 'Accepted',
                        message: 'Success',
                        result: []
                    });
            })
        })

        .delete( path + '/:id', mw.isAuth, mw.isMongoId, mw.isMe, function( req, res ) {
            User.delete( { _id: req.params.id }, req.body, function( error, result ) {
                if ( error ) {
                    throw error;
                }
                res
                    .status( 202 )
                    .json({
                        code: 202,
                        status: 'Accepted',
                        message: 'Success',
                        result: []
                    });
            });
        });

    return router;

};