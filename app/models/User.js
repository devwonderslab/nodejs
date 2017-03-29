var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    avatar: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
        default: parseInt( Date.now() / 1000 )
    }
});

var model = mongoose.model( 'user', Schema );
model.protectedFields = [ 'password' ];

Schema.pre('save', function(next, data){
    console.log(data)
})

module.exports = model;

