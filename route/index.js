var mongo = require('mongodb'),
    ObjectID = mongo.ObjectID,
    BSON = mongo.BSONPure,
    request = require('request'),
    S = require('string'),
    url = require('url'),
    bcrypt = require('bcryptjs'),
    DB = require('./db');
    // smsreceive = DB.smsreceive;


    exports.regiApi = function (req, res) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        var query = URI = operation = collectionModel = null;
        var option = {}, insertData = {}, fieldOption = {},inputval = {};

        if (req.method == 'POST') {
            query = req.body;
        } else {
            URI = decodeURIComponent(req.url);
            var queryString = URI.substring(URI.indexOf('?') + 1);
            query = parseQueryString(queryString);
        }

        query = toLowerQueryParam(query);
        var opt = query.option || null,
            id = query._id || null,
            collectionName = query.table.toString().toLowerCase(),
            operation = query.action.toString().toLowerCase(),
            paramater = query;
        delete paramater['action'];
        delete paramater['table'];
        var timestamp = new Date().toISOString();
        console.log("id is::::>>-->",id);
        //INITAIL CONDITION TO CHECK PARAMETERS
        try {
            if (opt == null) {
                if (id)
                // console.log("id is");
                    option = {_id : new ObjectID(id)};
                    // console.log();
                }else if(typeof opt == 'string'){
                  console.log("opt....",id);
                    try{
                        option = JSON.parse(opt);
                        insertData = option;
                        // console.log("inserted data is:--->",insertData);
                    }catch (e){
                      console.log(e);
                    }
                makeSearchRegExpFields(option);
              }
          }
        catch (e) {
            console.log(e);
          }

        //INITAIL CONDITION TO CHECK TABLE NAME
        try {
            if (collectionName == 'kinj') {
              // console.log("collection:--->");
                collectionModel = 'kinj';
                registrationapi();
            }
            else {
                res.send({"Result": "Wrong tablename", "status": "0"});
            }
        }
        catch (e) {
            console.log(e);
        }
          // INSERT / UPDATE / DELETE / RETRIVE CASE FUNCTION
          function registrationapi() {
              switch (operation) {
                // http://localhost:4567/personaldetails?action=retrive&table=kinj
                case 'retrive':
                    console.log("\n ========== Retrive Option ========= \n ");
                    try {
                        findIntoSingleDB(collectionName,option ,function(results){
                          if (results.length > 0) {
                              res.json(results);
                              // console.log("fin results:---->",results)
                          } else {
                              res.json({
                                  "success": "0"
                              });
                          }
                        });
                    }
                    catch (e) {
                        res.send(e);
                    }
                    break;
                    //http://localhost:4567/personaldetails?action=insert&table=kinj&option={%22name%22:%22kp%22,%22addr%22:%22abad%22}
                case 'insert':
                    console.log("\n ========== Insert Option ========= \n ");
                    try {
                      insertData.timestamp = timestamp;
                      // var table = collectionModel;
                      insertIntoDB(collectionName, insertData, function (results) {
                          if (results) {
                              res.send({
                                  "success": "1",
                                  "result": results
                              });
                          } else {
                              res.json({
                                  "success": "0"
                              });
                          }
                      });
                    } catch (e) {
                        console.log(e);
                    }
                    break;
                    //http://localhost:4567/personaldetails?action=update&table=kinj&_id=563c33d1626ddbe90d49a0ee&option={%22name%22:%22kinjalspatel%22,%22addr%22:%22surat%22}
                case 'update' :
                    try {
                      console.log("\n ========== Update Option ========= \n ");
              				// console.log('Update Query--' , query)
              				// console.log('where Updated id option------>>>>>' , id)
                      var option1 = {_id: new mongo.ObjectID(id)}
                      // console.log("opt1---------->>>>>>",option1);
              				// console.log('<<<<----insertData--..>>>>>>>>>' , data)
                      insertData.timestamp = timestamp;
              				findIntoSingleDB(collectionModel, option1, function(response){
              					// console.log("response",response[0])
              					student.collection(collectionModel, function(err, collection){
              						collection.update(response[0],{$set:option}, {safe:true, upsert:false, multi:true}, function(err, result) {
              							if(err){
              									console.log(err);
              									res.send(404);
              								}
              							else{
              	                  	console.log("done")
              						    	    res.send({"success":"1","result":option});
              								}
              						});
              					});
              				});
                    } catch (e) {

                    }
                    break;
                case 'delete' :
                    console.log("\n ========== Delete Option ========= \n ");
                    var table = collectionName;
                    try {
                        if (option._id) {
                            var query = {_id: option._id};
                            console.log("query:::",query)
                            findIntoSingleDB(collectionName, query, function (doc) {
                                if (doc && doc.length > 0) {
                                    removeFromDB(collectionName, {_id: doc[0]._id}, function (response) {
                                        if (response > 0) {
                                            res.send({"success": "1",
                                                "result": "entry has been deleted"});
                                        }
                                        else {
                                            res.send({"success": "0",
                                                "result": "entry not avialable"});
                                        }
                                    });
                                } else {
                                    res.send({"success": "0",
                                        "result": "entry not avialable"});
                                }
                            });
                        }
                        else {
                            res.send({"success": "0",
                              "result": "Please Supply ID "});
                            return;
                        }
                    }
                    catch (e) {
                        res.send(e);
                    }
                    break;
                default:
                    res.send({"result": "Wrong action", 
                      "status": "0"});
              }
        }
};

//Retrive query
var findIntoSingleDB = function(collection,option,callback) {
  console.log("option---------->>",option);
      var results = [];
      student.collection(collection, function (err, collection) {
              collection.find(option).toArray(function (err, results) {
                console.log("results:---",results);
                          if (!err && results.length > 0) {
                                    // console.log(results)
                                    callback(results);
                          } else {
                                     console.log(err)
                             }
                  });
          });
  };

//Insert Query
function insertIntoDB(Collection, option, callback) {
  // console.log("Collection",Collection);
  // console.log("option:-->",option);
    student.collection(Collection, {safe: true}, function (err, collection) {
        if (err) {
            console.log(err);
            callback(null);
        } else {
            collection.insert(option, {safe: true}, function (err, results) {
                if (err || !results) {
                    console.log(err);
                    callback(null);
                } else {
                    // console.log(results);
                    callback(results);
                }
            });
        }
    });
};

// Remove Query
function removeFromDB(collection, query, callback) {

  console.log("query id is:::--->>",query);
    student.collection(collection, {safe: true}, function (err, collection) {
        collection.remove(query, function (err, result) {
            if (err) {
                console.log(err, result);
                callback(result);
            } else {
                console.log(result + " row deleted.");
                callback(result);
            }
        });
    });
};

//CONVERT INTO LOWERCASE
var toLowerQueryParam = function (query) {
    var Query = {};
    for (var key in query) {
        Query[key.toLowerCase()] = query[key];
    }
    return Query;
}

//PARSE QUERY PARAMETER
var parseQueryString = function (queryString) {
    var params = {}, queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
};

//MAKE QUERY PARAMETER SERACHABLE FORMATE
function makeSearchRegExpFields(obj) {
    for (var key in obj) {
        if (typeof obj[key] === 'string') {
            var fidx = obj[key].indexOf('/');
            var lidx = obj[key].lastIndexOf('/');
            if (fidx > -1 && lidx > 0) {
                var str = obj[key].substring(fidx + 1, lidx);
                var ext = obj[key].substring(lidx + 1);
                obj[key] = new RegExp(str, ext);
            }
        } else if (typeof obj[key] === 'object') {
            makeSearchRegExpFields(obj[key]);
        }
    }
    return obj;
}
