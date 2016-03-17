var express = require('express');
var router = express.Router();
var Tweet = require('../models/Tweet');
var upload = require('multer')();

/* GET users listing. */
router.get('/', function(req, res, next) {

    Tweet.find(function(err, tweets){
        if(err){
            return next(err);
        }
        res.json(tweets);
    });

});

router.post('/', upload.array(), function(req, res, next) {
    var newTweet = {};
    newTweet.title = req.body.title;
    newTweet.body = req.body.body;

    Tweet.create(newTweet, function(err, tweet){
        if(err){
            return next(err);
        }
        res.json(tweet);
    });
});

router.get('/:id', function(req, res, next) {
    Tweet.findById(req.params.id, function(err, tweet){
        if(err){
            return next(err);
        }
        res.json(tweet);
    })
});

router.delete('/:id', function(req, res, next) {
    Tweet.findByIdAndRemove(req.params.id, function(err, tweet){
        if(err){
            return next(err);
        }
        res.json(tweet);
    })
});

router.put('/:id', upload.array(), function(req, res, next) {
    var newTweet = {};
    newTweet.title = req.body.title;
    newTweet.body = req.body.body;

    Tweet.findByIdAndUpdate(req.params.id, newTweet, function(err, tweet){
        if(err){
            return next(err);
        }
        res.json(tweet);
    })
});




module.exports = router;