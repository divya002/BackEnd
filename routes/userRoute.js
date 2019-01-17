var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var routes = function (userRegister) {
    userRegisterRouter = express.Router();
    var userRegisterController = require('../controller/registrationController')(userRegister);
    userRegisterRouter.route('/register')
        .post(userRegisterController.registerUser)
        .get(userRegisterController.auth.checkAuthenticated, userRegisterController.showUsers);
    userRegisterRouter.route('/login')
        .post(userRegisterController.login);
    userRegisterRouter.route('/checkemail')
        .post(userRegisterController.checkEmailAvailability);
    userRegisterRouter.route('/checkmobile')
        .post(userRegisterController.checkMobileAvailability);
    userRegisterRouter.route('/sendotp')
        .get(userRegisterController.sendotp);
    userRegisterRouter.route('/retryotp')
        .get(userRegisterController.retryotp);
    userRegisterRouter.route('/verifyotp')
        .post(userRegisterController.verifyotp);
    userRegisterRouter.use('/:userid', userRegisterController.findIdMiddleware);
    userRegisterRouter.route('/:userid/updatepassword')
        .patch(userRegisterController.updatePassword);

    return userRegisterRouter;
};
module.exports = routes;