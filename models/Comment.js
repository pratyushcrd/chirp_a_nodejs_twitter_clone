/**
 * Created by Pratyush on 22-03-2016.
 */

'use strict'

var mongoose = require('mongoose');
var validator = require('node-mongoose-validator');

var CommentSchema = new mongoose.Schema({
    _creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _tweet: {type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'},
    title: {type: String},
    body: {type: String, required: [true, 'cannot be empty']},
    updated_at: {type: Date, default: Date.now}
});

CommentSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});

module.exports = mongoose.model('Comment', CommentSchema);