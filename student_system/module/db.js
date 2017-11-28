/**
 * Created by Administrator on 2017/11/27 0027.
 */
var mongo=require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;    //��ѯ_id
//�����ļ�
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

exports.find=function(collectionName,obj,cb){
    _connect(function(error,db){
        var result=db.collection(collectionName).find(obj)
            result.toArray(function(err,data){
                cb(err,data);
            })
    })
}

exports.insert=function(collectionName,obj,cb){
    _connect(function(error,db){
       db.collection(collectionName).insertOne(obj,function(err){
          cb(err);
           db.close();
       })
    })
}

exports.update=function(collectionName,obj1,obj2,cb){
    _connect(function(error,db){
        db.collection(collectionName).update(obj1,obj2,function(err){
            cb(err);
            db.close();
        })
    })
}

exports.remove=function(collectionName,obj,cb){
    _connect(function(error,db){
        db.collection(collectionName).remove(obj,function(err){
           cb(err)
            db.close();
        })

    })

}