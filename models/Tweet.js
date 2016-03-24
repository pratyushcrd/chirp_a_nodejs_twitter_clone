/**
 * Created by Pratyush on 14-03-2016.
 */
'use strict'

var mongoose = require('mongoose');
var validator = require('node-mongoose-validator');

var TweetSchema = new mongoose.Schema({
    _creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required: [true, 'cannot be empty']},
    body: {type: String, required: [true, 'cannot be empty']},
    updated_at: {type: Date, default: Date.now},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

TweetSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});

module.exports = mongoose.model('Tweet', TweetSchema);