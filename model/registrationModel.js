var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var registrationModel = new Schema({
    fullName: {
        type: String,
        required:true
    },
    mobile: {
        type:Number,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    type: {
        type: String,
        required:true
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