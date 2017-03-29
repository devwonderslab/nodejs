var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var Schema = new mongoose.Schema({
    inviter: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    invitee: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    accepted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Number,
        default: parseInt( Date.now() / 1000 )
    }
});

var model = mongoose.model( 'friend', Schema );
model.protectedFields = [ 'password' ];

module.exports = model;

