var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var customerComplaintModel = new Schema({
    email: {
        type: String
    },
    heading: {
        type: String
    },
    description: {
        type: String
    },
    datecreated: {
        type: Date
    },
    dateupdated:{
        type:Date
    },
    status:{
        type:String
    },
    comment:{
        type:Array,
        "default":[]
    },


});

module.exports = mongoose.model('CustomerComplaint', customerComplaintModel);