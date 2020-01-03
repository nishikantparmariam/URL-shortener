const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const database_name = 'url-shortener';
const url = 'mongodb+srv://<>:<>@cluster0-fif98.mongodb.net/test?retryWrites=true&w=majority';
const mongoOptions = {useNewUrlParser:true, useUnifiedTopology: true};

const state = {
    db:null
};

const connect = (cb)=>{
    if(state.db){
        cb();
    } else {
        MongoClient.connect(url, mongoOptions, (err,client)=>{
            if(err){
                cb(err);
            } else {
                state.db = client.db(database_name);
                cb();
            }
        });
    }
}

const getPrimaryKey = (_id)=>{
    return ObjectID(_id);
}

const getDB = ()=>{
    return state.db;
}

module.exports = {connect, getPrimaryKey, getDB};
