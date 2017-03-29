var fs = require('fs');

module.exports = function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {
        if (err) {
            return callback( new Error(err) )
        };
        var rendered = content.toString();
        for ( var v in options ) {
            if ( typeof options[v] === 'number' ||  typeof options[v] === 'string' ) {
                var mask = '\\{\\s{0,}' + v + '\\s{0,}\\}';
                var regexp = new RegExp( mask, 'g' );
                rendered = rendered.replace( regexp, options [ v ] );
            }
        }
        return callback(null, rendered);
    });
};
