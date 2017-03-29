var validator = require('validator');

module.exports = function ( req, res, next ) {
    if( validator.isMongoId( req.params.id ) ) {
        next();
    } else {
        res.status( 400 )
            .json({
                code: 400,
                status: "Error",
                message: "Invalid ID",
                result: []
            });
    }
};