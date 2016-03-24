var express = require('express');
var router = express.Router();
var Tweet = require('../models/Tweet');
var User = require('../models/User');
var Comment = require('../models/Comment');
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
        newTweet.title = req.user.username;
        newTweet.body = req.body.body;
        newTweet.comments = [];

        newTweet.save(function (err, tweet) {
            if (!tweet) {
                console.log(err);
                res.status = 400;
                var errorField = Object.keys(err.errors)[0];
                var errorMessage = err.errors[errorField];
                res.json({error: errorField + ' ' + errorMessage});
            } else {
                req.user.tweets.push(tweet);
                req.user.save();
                res.json(tweet);
            }
        });

    }
});

router.get('/:id', function (req, res, next) {
    Tweet.findOne({_id: req.params.id})
        .exec(function (err, tweet) {
            if (!tweet) {
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
            //TODO ALSO DELTE COMMENTS FROM THE POST
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

router.get('/:id/comments', function (req, res, next) {

    Tweet.findOne({_id: req.params.id})
        .populate('comments')
        .exec(function (err, tweet) {
            if (err || tweet == null || tweet == undefined) {
                res.json({error: 'post not found'});
            } else {
                console.log(tweet);
                res.json(tweet.comments);
            }
        });

});

router.post('/:id/comments', upload.array(), function (req, res, next) {

    if (!req.user) {
        res.json({error: 'Not signed in'});
    } else {
        Tweet.findOne({_id: req.params.id})
            .populate('comments')
            .exec(function (err, tweet) {
                if (err) {
                    return next(err);
                } else {

                    var comment = new Comment();
                    comment.body = req.body.comment;
                    comment.title = req.user.username;
                    comment._creator = req.user._id;
                    comment._tweet = req.params.id;
                    comment.save(function (err, comment) {
                        if (err) {
                            res.json({error: 'comment not posted'});
                        } else {
                            req.user.comments.push(comment);
                            req.user.save();
                            tweet.comments.push(comment);
                            tweet.save();
                            res.json(comment);
                        }

                    });

                }
            });
    }
});

router.get('/:id/comments/:cid', function (req, res, next) {

    Comment.findOne({_id: req.params.cid})
        .exec(function (err, comment) {
            if (err) {
                res.json({error: 'Not found'});
            } else {
                res.json(comment);
            }
        });

});

router.delete('/:id/comments/:cid', upload.array(), function (req, res, next) {

    if (!req.user) {
        res.json({error: 'Not signed in'});
    } else {
        Tweet.findOne({_id: req.params.id})
            .populate('comments')
            .exec(function (err, tweet) {
                if (err) {
                    res.json({error: 'could not delete comment'});
                } else {
                    Comment.findOneAndRemove({_id: req.params.cid}, function (err, comment) {
                        if (err) {
                            res.json({error: 'could not delete comment'});
                        } else {
                            req.user.comments.pull(req.params.cid);
                            tweet.comments.pull(req.params.cid);
                            req.user.save();
                            tweet.save();
                            res.json(comment);
                            //AUTHORIZATION REMAINING .. ANY SIGNED IN USER CAN DELETE THE POST/COMMENT NOW
                        }
                    });
                }
            });
    }
});


module.exports = router;