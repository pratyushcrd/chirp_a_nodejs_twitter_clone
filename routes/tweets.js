var express = require('express');
var router = express.Router();
var Tweet = require('../models/Tweet');
var User = require('../models/User');
var upload = require('multer')();

router.get('/', function (req, res, next) {

    Tweet.find(function (err, tweets) {
        if (err) {
            return next(err);
        }
        res.json(tweets);
    });

});

router.post('/', upload.array(), function (req, res, next) {

    if (!req.user) {
        res.json({error: 'Not logged in'});
    } else {


        var newTweet = new Tweet({});
        newTweet._creator = req.user._id;
        newTweet.title = '@' + req.user.username;
        newTweet.body = req.body.body;


        newTweet.save(function (err, tweet) {
            if (err) {
                console.log(err);
                res.status = 400;
                var errorField = Object.keys(err.errors)[0];
                var errorMessage = err.errors[errorField];
                res.json({error: errorField + ' ' + errorMessage});
            } else {
                res.json(tweet);
                req.user.tweets.push(tweet);
                req.user.save();
                console.log(req.user);
            }
        });

    }
});

router.get('/:id', function (req, res, next) {
    Tweet.findOne({_id: req.params.id})
        .exec(function (err, tweet) {
            if (err) {
                return next(err);
            }
            res.json(tweet);
        });
});

router.delete('/:id', function (req, res, next) {
    if (req.user) {
        Tweet.findByIdAndRemove(req.params.id, function (err, tweet) {
            if (err) {
                return next(err);
            }
            req.user.tweets.pull(tweet._id);
            req.user.save();
            res.json(tweet);
        });
    } else {
        res.json({error: "Not logged in"});
    }
});

router.put('/:id', upload.array(), function (req, res, next) {
    if (req.user) {
        var newTweet = {};
        newTweet.title = req.body.title;
        newTweet.body = req.body.body;

        Tweet.findOneAndUpdate(req.params.id, newTweet, function (err, tweet) {
            if (err) {
                res.status = 400;
                var errorField = Object.keys(err.errors)[0];
                var errorMessage = err.errors[errorField];
                res.json({error: errorField + ' ' + errorMessage});
            }
            res.json(tweet);
        })
    } else {
        res.json({error: "Not logged in"});
    }
});


module.exports = router;