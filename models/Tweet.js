/**
 * Created by Pratyush on 14-03-2016.
 */
var mongoose = require('mongoose');

var TweetSchema = new mongoose.Schema({
    title: String,
    body: String,
    updated_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Tweet', TweetSchema);