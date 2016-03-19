/**
 * Created by Pratyush on 18-03-2016.
 */
var express = require('express');
var passport = require('passport');
var User = require('../models/User');
var upload = require('multer')();
var router = express.Router();

router.post('/register', upload.array(), function (req, res) {

    User.findOne({'email': req.body.email}, function (err, user) {
        if (user) {
            res.json({error: ['Email exists']});
        } else {

            //Register Logic
            User.register(new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }), req.body.password, function (err, user) {
                if (err) {

                    // Validation error logic
                    if (err.name == 'ValidationError') {
                        var errors = [];
                        for (objectKey in err.errors) {
                            errors.push(objectKey + ' ' + err.errors[objectKey].message);
                        }
                        return res.json({error: errors});

                    }// Validation error logic ends
                    else if (err.name == 'UserExistsError') {
                        res.json({error: ['username exists']});
                    } else {
                        res.json({error: ['not valid data']});
                    }
                }
                // Register success
                passport.authenticate('local')(req, res, function () {
                    res.json({success: 'success'});
                });
            });// Register logic ends

        }

    });

});

router.get('/user', function (req, res) {
    var user = {};
    if(req.user){
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