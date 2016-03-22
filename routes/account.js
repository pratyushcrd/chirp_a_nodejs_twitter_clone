/**
 * Created by Pratyush on 18-03-2016.
 */
var express = require('express');
var passport = require('passport');
var User = require('../models/User');
var upload = require('multer')();
var router = express.Router();

router.post('/register', upload.array(), function (req, res) {

    User.findOne({username: req.body.username}, function (err, user) {
        if (user) {
            res.json({error: "User with same username exixts"});
        } else if (!req.body.password) {
            res.json({error: "password cannot be empty"});
        } else if (req.body.password.length < 6) {
            res.json({error: "pass must be minimum 6 charaters"});
        } else {
            console.log('registering user');
            User.register(new User({
                username: req.body.username,
                email: req.body.email
            }), req.body.password, function (err, user) {
                if (err) {
                    console.log('error while user register!', err, user);
                    res.json({error: "error", error: err, user: user});
                } else {
                    res.json({success: "success", user: user, error: err});
                }
            });
        }
    });


});

router.post('/exists', upload.array(), function (req, res) {

    if (req.body.username) {

        User.findOne({username: req.body.username}, function (err, user) {
            if (user) {
                res.json({exists: "true"});
            } else {
                res.json({exists: "false"});
            }
        });

    } else if (req.body.email) {

        User.findOne({email: req.body.email}, function (err, user) {
            if (user) {
                res.json({exists: "true"});
            } else {
                res.json({exists: "false"});
            }
        });

    } else {

        res.json({});

    }

});

router.get('/user', function (req, res) {
    var user = {};
    if (req.user) {
        user.id = req.user._id;
        user.email = req.user.email;
        user.username = req.user.username;
    }
    res.json(user);
});


router.post('/login', upload.array(), passport.authenticate('local'), function (req, res) {
    res.json({success: "success"});
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;