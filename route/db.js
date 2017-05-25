
/* ========================== mongo db connection - start =================================== */
var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

// DB Farm
function openPushDB(ip, port, callback) {
    var server = new Server(ip, port, {
        auto_reconnect: true
    });
    student = new Db('student', server);
    student.open(function (err, db) {
        if (!err && db) {
            console.log("student", db.databaseName, db.serverConfig.host, db.serverConfig.port);
            callback(true);
        } else {
            console.log(err, db);
            callback(false);
        }
    });
};

openPushDB('localhost', 27017, function (flag) {
    if (flag == false) {
        console.log("mongodb connection with DB Farm... fail");
    } else {
        console.log("mongodb connection with DB Farm.....success");
    }
});


/* ========================== mongo db connection - end =================================== */
