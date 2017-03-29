module.exports = function ( req, res, next ) {
    if ( req._userId ) {
        next();
    } else {
        res.status( 401 )
            .json({
                code: 401,
                message: "Unauthorized",
                status: "Unauthorized",
                result: []
            });
    }
};