/**
 * Created by Pratyush on 14-03-2016.
 */
var app = angular.module('myApp', ['ngResource']);

app.factory(
    'Tweet', function ($resource) {
        return $resource('tweets/:id', null, {
            'update': {method: 'PUT'}
        });
    }
);

app.controller('TweetController', function ($http, Tweet) {
    var _this = this;
    _this.tweets = [];
    _this.postObjectTweet = {};
    _this.showTweetFlag = [];
    _this.showEditForm = [];
    _this.postErrorMessage = '';
    _this.updateErrorMessage = [];

    _this.tweets = Tweet.query(function () {
        for (var i in _this.tweets) {
            _this.showTweetFlag.push(true);
            _this.showEditForm.push(false);
        }
        _this.tweets = _this.tweets.reverse();
    });

    _this.changeEditFormVisibility = function (index) {
        _this.showEditForm[index] = !_this.showEditForm[index];
    };


    _this.updateTweet = function (index) {

        Tweet.update({id: _this.tweets[index]._id}, _this.tweets[index], function (tweet) {
            if (tweet.error) {
                _this.updateErrorMessage[index] = tweet.error;
            } else {
                _this.showEditForm[index] = false;
            }
            console.log(tweet);
        }, function (err) {
        });

    };

    _this.deleteTweet = function (index) {
        Tweet.remove({id: _this.tweets[index]._id}, function (tweet, err) {
            _this.showTweetFlag[index] = false;
        });

    };

    this.postTweet = function () {

        var newTweet = new Tweet();
        newTweet.title = _this.postObjectTweet.title;
        newTweet.body = _this.postObjectTweet.body;
        newTweet.$save(function (tweet) {
            // called when saved successfully or validation error

            if (tweet.error) {
                _this.postErrorMessage = tweet.error;
            } else {
                _this.tweets.unshift(tweet);
                _this.showTweetFlag.unshift(true);
                _this.postObjectTweet = {};
                _this.showEditForm.unshift(false);
                _this.postErrorMessage = '';
            }

        }, function (err) {
            // called when error arrives
            console.log(err);
        });

    }
});
