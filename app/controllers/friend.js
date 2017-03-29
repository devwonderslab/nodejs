var md5 = require('md5');

var mw = global.middleware;
var User = global.models.User;
var Friend = global.models.Friend;

module.exports = function( path, router, config ) {

    router
        .get( path, mw.isAuth, function( req, res ) {

            var page = parseInt( req.query.page ) ? parseInt( req.query.page ) : 1;
            var perPage = parseInt( req.query.perPage ) ? parseInt( req.query.perPage ) : 10;

            Friend
                .find({
                    $or: [
                            { inviter: req._userId, accepted: true },
                            { invitee: req._userId, accepted: true }
                        ]
                })
                .skip( perPage*( page - 1 ) )
                .limit( perPage )
                .populate('inviter invitee')
                .exec( function ( err, friends ) {
                    if ( err ) {
                        throw err;
                    }
                    var users = [];
                    var user;
                    friends.map( function( friend ) {
                       if ( friend.inviter._id.toString() === req._userId.toString() ) {
                           user = friend.invitee;
                           user.createdAt = friend.createdAt;
                           user.isInvitedByMe = true;
                           users.push( user );
                       }  else {
                           user = friend.inviter;
                           user.createdAt = friend.createdAt;
                           user.isInvitedByMe = false;
                           users.push( user );
                       }
                    });
                    var total_pages = Math.ceil( friends.length / perPage );
                    res.set( 'X-Pagination-Current-Page', page );
                    res.set( 'X-Pagination-Per-Page', perPage );
                    res.set( 'X-Pagination-Total-Pages', total_pages );
                    res.set( 'X-Pagination-Total-Entries', friends.length );
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

    router
        .get( path + '/requests', mw.isAuth, function( req, res ) {

            var page = parseInt( req.query.page ) ? parseInt( req.query.page ) : 1;
            var perPage = parseInt( req.query.perPage ) ? parseInt( req.query.perPage ) : 10;

            Friend
                .find({
                    $or: [
                        { inviter: req._userId, accepted: false },
                        { invitee: req._userId, accepted: false }
                    ]
                })
                .skip( perPage*( page - 1 ) )
                .limit( perPage )
                .populate('inviter invitee')
                .exec( function ( err, friends ) {
                    if ( err ) {
                        throw err;
                    }
                    var users = [];
                    var user;
                    friends.map( function( friend ) {
                        if ( friend.inviter._id.toString() === req._userId.toString() ) {
                            user = friend.invitee;
                            user.createdAt = friend.createdAt;
                            user.isInvitedByMe = true;
                            users.push( user );
                        }  else {
                            user = friend.inviter;
                            user.createdAt = friend.createdAt;
                            user.isInvitedByMe = false;
                            users.push( user );
                        }
                    });
                    var total_pages = Math.ceil( friends.length / perPage );
                    res.set( 'X-Pagination-Current-Page', page );
                    res.set( 'X-Pagination-Per-Page', perPage );
                    res.set( 'X-Pagination-Total-Pages', total_pages );
                    res.set( 'X-Pagination-Total-Entries', friends.length );
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

        .post( path + '/accept/:id', mw.isAuth, mw.isMongoId, mw.notMe, function( req, res ) {
            Friend
                .find({ inviter: req.params.id, invitee: req._userId, accepted: false } )
                .exec( function ( err, friends ) {
                    if ( err ) {
                        throw err;
                    }
                    if ( ! friends.length ) {
                        console.log({ inviter: req._userId, invitee: req.params.id })
                        Friend.create( { inviter: req._userId, invitee: req.params.id }, function( err, result ) {
                            if ( err ) {
                                res
                                    .status( 400 )
                                    .json({
                                        code: 400,
                                        status: 'Error',
                                        message: 'Request was not successfully added',
                                        result: [ err ]
                                    });
                            } else {
                                res
                                    .status( 201 )
                                    .json({
                                        code: 201,
                                        status: 'Created',
                                        message: 'New friend was successfully added',
                                        result: [ result ]
                                    });
                            }

                        })
                    } else {
                        res
                            .status( 404 )
                            .json({
                                code: 404,
                                status: 'Error',
                                message: 'Request was not found',
                                result: []
                            });
                    }
                });
        })

        .post( path + '/:id', mw.isAuth, mw.isMongoId, mw.notMe, function( req, res ) {
            Friend
                .find({
                    $or: [
                            { inviter: req.params.id, invitee: req._userId },
                            { invitee: req.params.id, inviter: req._userId }
                        ]
                })
                .exec( function ( err, friends ) {
                    if ( err ) {
                        throw err;
                    }
                   if ( ! friends.length ) {
                        Friend.create( { inviter: req._userId, invitee: req.params.id }, function( err, result ) {
                            if ( err ) {
                                res
                                    .status( 400 )
                                    .json({
                                        code: 400,
                                        status: 'Error',
                                        message: 'New friend was not successfully added',
                                        result: [ err ]
                                    });
                            } else {
                                res
                                    .status( 201 )
                                    .json({
                                        code: 201,
                                        status: 'Created',
                                        message: 'New friend was successfully added',
                                        result: [ result ]
                                    });
                            }

                        })
                   } else {
                       res
                           .status( 400 )
                           .json({
                               code: 400,
                               status: 'Error',
                               message: 'User is already your friend',
                               result: []
                           });
                   }
                });
        })


        .delete( path + '/:id', mw.isAuth, mw.isMongoId, mw.notMe, function( req, res ) {
            Friend
                .remove({
                    $or: [
                        { inviter: req.params.id, invitee: req._userId },
                        { invitee: req.params.id, inviter: req._userId }
                    ]
                }, function ( err, result ) {
                    if ( err ) {
                        throw err;
                    }

                    res
                            .status( 202 )
                            .json({
                                code: 202,
                                status: 'Accepted',
                                message: 'Accepted',
                                result: [result]
                            });
                });
        });

    return router;

};
