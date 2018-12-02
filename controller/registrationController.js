var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var registrationController = function (userRegister) {
    var get = function (req, res) {
        query = {};

        userRegister.find(query, function (err, users) {
            if (err)
                res.status(500).send(err);
            else {
                res.json(users);
            }
        });
    };
    var post = function (req, res) {
        var user = new userRegister(req.body);
        // user.save();
        user.save((err, newUser) => {
            if (err)
                return res.status(500).send({
                    message: 'Error saving user'
                });
            console.log(newUser);
            createSendToken(res, newUser);
        });
        // res.status(201).send(user);
    };
    var login = async function (req, res) {
        var loginData = req.body;

        var user = await userRegister.findOne({
            email: loginData.email
        });

        if (!user)
            return res.status(401).send({
                message: 'Email or Password invalid'
            });

        bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
            if (!isMatch)
                return res.status(401).send({
                    message: 'Email or Password invalid'
                });

            createSendToken(res, user);
        });
    }

    var checkEmailAvailability = async function (req, res) {
        var loginData = req.body;

        var email = await userRegister.findOne({
            email: loginData.email
        });
        if (email)
            return res.json({
                message: 'This email already registered',
                valid: false
            });
        else {
            return res.json({
                message: 'Looks Good emailID',
                valid: true
            });
        }

    }
    var checkMobileAvailability = async function (req, res) {
        var loginData = req.body;
        var mobile = await userRegister.findOne({
            mobile: loginData.mobile
        });
        if (mobile)
            return res.json({
                message: 'This mobile already registered',
                valid: false
            });
        else {
            return res.json({
                message: 'Looks Good number',
                valid: true
            });
        }

    }

    function createSendToken(res, user) {
        var payload = {
            sub: user._id
        };

        var token = jwt.encode(payload, '123');

        res.status(200).send({
            token: token,
            type: user.type,
            email:user.email

        });
    }
    var auth = {
        checkAuthenticated: (req, res, next) => {
            if (!req.header('authorization'))
                return res.status(401).send({
                    message: 'Unauthorized. Missing Auth Header'
                });

            var token = req.header('authorization').split(' ')[1];

            var payload = jwt.decode(token, '123');

            if (!payload)
                return res.status(401).send({
                    message: 'Unauthorized. Auth Header Invalid'
                });

            req.userId = payload.sub;

            next();
        }
    }
    return {
        post: post,
        get: get,
        login: login,
        checkEmailAvailability: checkEmailAvailability,
        checkMobileAvailability: checkMobileAvailability,
        auth: auth
    };
};

module.exports = registrationController;