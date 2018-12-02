
var jwt = require('jwt-simple');
var customerComplaintController = function (customerComplaint) {
    var get = function (req, res) {
        query = {};
        
        customerComplaint.find(query, function (err, complain) {
            if (err)
                res.status(500).send(err);
            else {
                var returncomplain={};
                returncomplain.result=complain;
                res.status(200).send(returncomplain);
            }
        });
    };
    var post = function (req, res) {
        var customerComplain = new customerComplaint(req.body);
        // user.save();
        customerComplain.save((err, newComplain) => {
            if (err)
                return res.status(500).send({
                    message: 'Error saving complain'
                });
                res.status(201).send(newComplain);
        });
       // res.status(201).send(user);
    };
    var findIdMiddleware = function (req, res, next) {
        customerComplaint.findById(req.params.complainId, function (err, complain) {
            if (err)
                res.status(500).send(err);
            else if (complain) {
                req.complain = complain;
                next();
            } else {
                res.status(200).send("No Complain Found")
            }
        });
    };
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
    };
    return {
        post: post,
        get: get,
        auth:auth,
        findIdMiddleware:findIdMiddleware
    };
};
module.exports = customerComplaintController;