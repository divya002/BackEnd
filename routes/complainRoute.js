var express = require('express');
var jwt = require('jwt-simple');

var routes = function (customerComplaint) {
    customerComplaintRouter = express.Router();
    var customerComplaintController = require('../controller/customerComplaintController')(customerComplaint);
    customerComplaintRouter.route('/')
        .post(customerComplaintController.auth.checkAuthenticated, customerComplaintController.post)
        .get(customerComplaintController.auth.checkAuthenticated, customerComplaintController.get);

    customerComplaintRouter.use('/:complainId', customerComplaintController.findIdMiddleware);
    customerComplaintRouter.route('/:complainId')
        .get(function (req, res) {
           // var returnComplain = req.complain.toJSON();
           // res.json(returnComplain);
            var returnUser = {};
                    returnUser.result = req.complain;
                    res.status(200).send(returnUser);
        })
        .put(function (req, res) {
            req.complain.email = req.body.email;
            req.complain.heading = req.body.heading;
            req.complain.description = req.body.description;
            req.complain.datecreated = req.body.datecreated;
            req.complain.dateupdated = req.body.dateupdated;
            req.complain.status = req.body.status;
            req.complain.comment = req.body.comment;
            req.complain.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    var returnUser = {};
                    returnUser.result = req.complain;
                    res.status(200).send(returnUser);
                }
            });
        })
        .patch(function (req, res) {
            if (req.body._id)
                delete req.body._id;
            for (var p in req.body) {
                req.complain[p] = req.body[p];
            }
            req.complain.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    var returnUser = {};
                    returnUser.result = req.complain;
                    res.status(200).send(returnUser);
                }
            });
        });
    return customerComplaintRouter;
};
module.exports = routes;