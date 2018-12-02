var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var routes = function (userRegister) {
    userRegisterRouter = express.Router();
    var userRegisterController = require('../controller/registrationController')(userRegister);
    userRegisterRouter.route('/')
        .post(userRegisterController.post)
        .get(userRegisterController.auth.checkAuthenticated,userRegisterController.get);
    userRegisterRouter.route('/login')
        .post(userRegisterController.login);
    userRegisterRouter.route('/checkemail')
        .post(userRegisterController.checkEmailAvailability);
    userRegisterRouter.route('/checkmobile')
        .post(userRegisterController.checkMobileAvailability);
    userRegisterRouter.route('/login/forgetpassword')
        .post(function (req, res) {
            var query = {};
            if (req.body.email) {
                query.email = req.body.email;
                userRegister.find(query, function (err, user) {
                    if (err) {
                        res.status(500).send(err);
                        alert("err");
                    } else {
                        if (user[0].username) {
                            res.json(user[0].password);
                        } else {
                            res.send("UserNotAvailable");
                        }
                    }
                });
            }

        });
    return userRegisterRouter;
};
module.exports = routes;