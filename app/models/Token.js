var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var Schema = new mongoose.Schema({
    token: String,
    userId: {
        type: ObjectId,
        ref: 'user'
    },
    userIp: String,
    userAgent: String
});

var model = mongoose.model('token', Schema);

module.exports = model;
