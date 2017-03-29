module.exports = function( req, res, next ) {
    if ( req._userId != req.path.id ) {
        next();
    } else {
        res.status( 403 )
            .json({
                code: 403,
                message: "Access denied",
                status: "Forbidden",
                result: []
            });
    }
};
