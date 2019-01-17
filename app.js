var express = require("express"),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
var cors = require('cors');
var jwt = require('jwt-simple');
var db = mongoose.connect('mongodb://divya:divya002@ds159634.mlab.com:59634/nearme', {
    //useMongoClient: true
    useNewUrlParser: true
}, (err) => {
    if (!err)
        console.log("MongoDB DataBase Connected");
    else {
        console.log("Error in connection with database");
    }
});
var userRegister = require("./model/registrationModel");
var customerComplaint = require("./model/customerComplaintModel");
var userRegisterRouter = require('./routes/userRoute')(userRegister);
var customerComplaintRouter = require('./routes/complainRoute')(customerComplaint);
mongoose.Promise = Promise;

var port = process.env.PORT || 8000;
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.listen(port, function () {
    console.log("App started Listening at " + port);
});
app.use("/api/users", userRegisterRouter);
app.use("/api/complains", customerComplaintRouter);
app.get('/', function (req, res) {
    res.send("Welcome to our API");
});