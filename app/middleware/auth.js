var Token = require( __dirname + '/../models/Token');

module.exports = function ( req, res, next ) {
    if ( req.get('Authorization') ) {
        var token = req.get('Authorization').replace('Bearer ', '');
        var userAgent = req.get('user-agent');
        var userIp = req.get('x-forwarded-for') || req.connection.remoteAddress;
        Token.find( { token: token, userIp: userIp, userAgent: userAgent }, function (err, tokens) {
            console.log('tokens', tokens)
            if ( !!tokens.length ) {
                req._userId = tokens[0].userId.toString();
                next();
            } else {
                res
                    .status(403)
                    .json({
                        code: 403,
                        message: "Access Denied",
                        status: "Forbidden",
                        result: []
                    });
            }
        });
    } else {
        next();
    }
};
