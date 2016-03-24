/**
 * Created by Pratyush on 18-03-2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var validator = require('node-mongoose-validator');

var User = new Schema({
    email: {type: String, index: {unique: true, dropDups: true}},
    username: {type: String, required: true, index: {unique: true, dropDups: true}},
    password: String,
    tweets: [{type: Schema.Types.ObjectId, ref: 'Tweet'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

User.path('username').validate(validator.isAlphanumeric(), 'must not special characters');
User.path('email').validate(validator.isEmail(), 'is not email');
User.path('username').validate(validator.isLength(6, 18), 'must be between 6 to 18 characters');
User.path('username').validate(validator.isLowercase(), 'must be lowercase');

User.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = mongoose.model('User', User);