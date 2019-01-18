var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('233044AQFlg7c95b7cecc5', 'Nearme Authentication OTP is {{otp}}, Please do not share it with anybody');
sendOtp.setOtpExpiry('60');

var registrationController = function (userRegister) {

    var showUsers = function (req, res) {
        query = {};

        userRegister.find(query, function (err, users) {
            if (err)
                res.status(500).send(err);
            else {
                res.send(200, users);
            }
        });
    };

    var registerUser = function (req, res) {
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
    var findIdMiddleware = function (req, res, next) {
        userRegister.findById(req.params.userid, function (err, user) {
            if (err)
                res.status(500).send(err);
            else if (user) {
                req.user = user;
                next();
            } else {
                res.status(200).send("No user Found")
            }
        });
    };
    var sendotp = function (req, res) {
        var mobile = req.query.mobile;
        sendOtp.send(mobile, "Nearme", function (error, data) {
            console.log(data);
            res.json(data);
        });
    };

    var retryotp = function (req, res) {
        var mobile = req.query.mobile;
        sendOtp.retry(mobile, false, function (error, data) {
            console.log(data);
            res.json(data);
        });
    };

    var verifyotp = function (req, res) {
        var mobile = req.body.mobile;
        var otp = req.body.otp;
        sendOtp.verify(mobile, otp, function (error, data) {
            console.log(data); // data object with keys 'message' and 'type'
            if (data.type == 'success') res.status(200).send({
                message: 'OTP verified successfully'
            });
            if (data.type == 'error') res.status(200).send({
                message: 'OTP verification failed'
            });
        });
    };

    var login = async function (req, res) {
        var loginData = req.body;

        var user = await userRegister.findOne({
            mobile: loginData.mobile
        });

        if (!user)
            return res.status(401).send({
                message: 'User not Found'
            });

        bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
            if (!isMatch)
                return res.status(401).send({
                    message: 'Password invalid..Please try again.'
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

    var updatePassword = function (req, res) {
        if (req.body._id)
            delete req.body._id;
        for (var p in req.body) {
            req.user[p] = req.body[p];
        }
        req.user.save(function (err) {
            if (err)
                res.status(500).send(err);
            else {
                var returnUser = {};
                returnUser.result = req.user;
                res.status(200).send(returnUser);
            }
        });
    };

    var checkMobileAvailability = async function (req, res) {
        var number = req.query.mobile;
        var mobile = await userRegister.findOne({
            mobile: number
        });
        if (mobile)
            return res.status(401).send({
                message: 'This mobile already registered',
                valid: false
            });
        else {
            return res.status(201).send({
                message: 'Looks Good..',
                valid: true
            });
        }

    }

    function createSendToken(res, user) {
        var payload = {
            sub: user._id
        };

        var token = jwt.encode(payload, 'nearme@12#$');

        res.send(201, {
            token: token,
            userid: user._id,
            type: user.type
        });
    }
    var auth = {
        checkAuthenticated: (req, res, next) => {
            if (!req.header('authorization'))
                return res.status(401).send({
                    message: 'Unauthorized. Missing Auth Header'
                });

            var token = req.header('authorization').split(' ')[1];

            var payload = jwt.decode(token, 'nearme@12#$');

            if (!payload)
                return res.status(401).send({
                    message: 'Unauthorized. Auth Header Invalid'
                });

            req.userId = payload.sub;

            next();
        }
    }
    return {
        showUsers: showUsers,
        registerUser: registerUser,
        login: login,
        findIdMiddleware: findIdMiddleware,
        sendotp: sendotp,
        verifyotp: verifyotp,
        retryotp: retryotp,
        updatePassword: updatePassword,
        checkEmailAvailability: checkEmailAvailability,
        checkMobileAvailability: checkMobileAvailability,
        auth: auth
    };
};

module.exports = registrationController;