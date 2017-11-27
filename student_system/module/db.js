/**
 * Created by Administrator on 2017/11/27 0027.
 */
var mongo=require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;    //≤È—Ø_id
//≈‰÷√Œƒº˛
var config=require('./config.js');

function _connect(callback){

    mongo.connect(config.dbUrl,function(err,db){
        if(err){
            console.log(err);
            return;
        }
        callback(err,db)
    })
}

function find(collectionName,obj,cb){
    _connect(function(error,db){
        var result=db.collectionName.find(obj)
            result.toArray(err,function(){
                cb(err,data);
            })
        })
    })
}