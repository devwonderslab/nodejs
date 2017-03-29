var mw = global.middleware;
var Post = global.models.Post;

module.exports = function( path, router, config ) {

    router
        .get( path, mw.isAuth, function( req, res ) {

            var page = parseInt( req.query.page ) ? parseInt( req.query.page ) : 1;
            var perPage = parseInt( req.query.perPage ) ? parseInt( req.query.perPage ) : 10;

            Post
                .find()
                .skip( perPage*( page - 1 ) )
                .limit( perPage )
                .exec( function ( err, posts ) {
                    if ( err ) {
                        throw err;
                    }
                    var total_pages = Math.ceil( posts.length / perPage );
                    res.set( 'X-Pagination-Current-Page', page );
                    res.set( 'X-Pagination-Per-Page', perPage );
                    res.set( 'X-Pagination-Total-Pages', total_pages );
                    res.set( 'X-Pagination-Total-Entries', posts.length );
                    res
                        .status( 200 )
                        .json({
                            code: 200,
                            status: 'OK',
                            message: 'Success',
                            result: posts
                        });
                });
        })

        .post( path, mw.isAuth, function( req, res ) {

            Post.create( req.body, function( error, post ) {
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
                            result: [ post ]
                        });
                }
            });
        })

        .get( path + '/:id', mw.isAuth, mw.isMongoId, function( req, res ) {
            Post.find ( { _id: req.params.id }, function( error, posts ) {
                if ( error ) {
                    throw error;
                }
                if ( !! posts.length ) {
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
                            status: 'No Found',
                            message: 'Post was not found',
                            result: []
                        });
                }
            })

        })

        .get( path + '/user/:id', mw.isAuth, mw.isMongoId, function( req, res ) {

            var page = parseInt( req.query.page ) ? parseInt( req.query.page ) : 1;
            var perPage = parseInt( req.query.perPage ) ? parseInt( req.query.perPage ) : 10;

            Post
                .find ( { userId: req.params.id })
                .skip( perPage*( page - 1 ) )
                .limit( perPage )
                .exec( function( error, posts ) {
                if ( error ) {
                    throw error;
                }
                if ( !! posts.length ) {
                    var total_pages = Math.ceil( posts.length / perPage );
                    res.set( 'X-Pagination-Current-Page', page );
                    res.set( 'X-Pagination-Per-Page', perPage );
                    res.set( 'X-Pagination-Total-Pages', total_pages );
                    res.set( 'X-Pagination-Total-Entries', posts.length );
                    res
                        .status( 200 )
                        .json({
                            code: 200,
                            status: 'OK',
                            message: 'Success',
                            result: posts
                        });
                } else {
                    res
                        .status( 404 )
                        .json({
                            code: 404,
                            status: 'No Found',
                            message: 'Post was not found',
                            result: []
                        });
                }
            })

        })

        .put( path + '/:id', mw.isAuth, mw.isMongoId, function( req, res ) {
            Post.update( { _id: req.params.id }, req.body, function( error, result ) {
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

        .delete( path + '/:id', mw.isAuth, mw.isMongoId, function( req, res ) {
            Post.delete( { _id: req.params.id }, req.body, function( error, result ) {
                if ( error ) {
                    throw error;
                }
                res
                    .status( 202 )
                    .json({
                        code: 202,
                        status: 'Accepted',
                        message: 'Success',
                        result: [result]
                    });
            });
        });

    return router;

};