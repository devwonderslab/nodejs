var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    author: {
        type: ObjectId,
        ref: 'user'
    },
    canRead:{
        type: Array,
        items: {
            type: ObjectId,
            ref: 'user'
        }
    },
    createdAt: {
        type: Number,
        default: parseInt( Date.now() / 1000 )
    }
});

var model = mongoose.model( 'post', Schema );

module.exports = model;

