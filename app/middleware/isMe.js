module.exports = function( req, res, next ) {
    if ( req._userId === req.path.id ) {
        next();
    } else {
        res.status( 400 )
            .json({
                code: 400,
                message: "You can\'t apply this action with own ID",
                status: "Bad request",
                result: []
            });
    }
};
