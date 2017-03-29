var md5 = require('md5');
var mw = global.middleware;
var User = global.models.User;
var Token = global.models.Token;

module.exports = function( path, router, config ) {

    router
        .get( path, function( req, res ) {

            res.render( 'index', {} );

        })

        .post( path + 'access-token', function( req, res ) {

            if ( req.body.email && req.body.password ) {
                User.find( { email: req.body.email, password: md5( req.body.password ) }, function( error, users ) {
                    if ( error ) {
                        throw error;
                    }
                    if ( users.length ) {
                        var token = new Token({
                            token: md5( Date.now() ),
                            userId: users[0]._id,
                            userAgent: req.get('user-agent'),
                            userIp: req.get('x-forwarded-for') || req.connection.remoteAddress
                        });
                        token.save( function( error ) {
                            if ( error ) {
                                throw error;
                            }
                            res
                                .status( 201 )
                                .json({
                                    code: 201,
                                    status: 'Created',
                                    message: 'Success',
                                    result: [ { token: token, user: users[0] } ]
                                });
                        })
                    } else {
                        res
                            .status( 403 )
                            .json({
                                code: 403,
                                status: 'Access denied',
                                message: 'Access denied',
                                result: []
                            });
                    }
                })
            } else {
                res
                    .status( 400 )
                    .json({
                        code: 400,
                        status: 'Bad request',
                        message: 'email and password are required fields',
                        result: []
                    });
            }

        });

    return router;

};