var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var registrationModel = new Schema({
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: String
    },

});
registrationModel.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password'))
        return next();

    bcrypt.hash(user.password, null, null, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});
module.exports = mongoose.model('Users', registrationModel);