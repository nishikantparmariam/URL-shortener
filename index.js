const express = require('express');
const ejs = require('ejs');
const db = require('./db');
const parser = require('body-parser');
const PORT = 8000;
const constant_num = 1545959;

/*Core Logic*/
const symbols = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = 62;
const B_62_shorturl = (counter)=>{
    var shorturl = "";
    if(counter==0) shorturl = "0";
    while(counter>0){
        remainder = counter%BASE;
        shorturl=symbols[remainder]+shorturl;
        counter = Math.floor(counter/BASE);
    }

    return shorturl;
};


const app = express();
app.use(parser.json());
app.use(parser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views','./views');

app.get('/',(request, response)=>{
    response.render("home.ejs",{});     
});

app.get('/giveShortUrl',(request, response)=>{
    console.log(request.query);
    var toSend = {
        shorturl:null,
        error:true,
        longurl:request.query.url      
    }
    var toInsert = {
        longurl:request.query.url,
        _id:null
    }
    
    db.getDB().collection("urls").countDocuments({},(err,result)=>{
        if(err){
            response.send(toSend);
        } else {
            var shorturl = B_62_shorturl(result+constant_num);
            toSend.shorturl = shorturl;
            toInsert.shorturl = shorturl;
            toInsert._id = shorturl;
            db.getDB().collection("urls").insertOne(toInsert);              
            toSend.error = false;
            response.send(toSend);
        }
    });
});

app.get('/:shorturl',(request, response)=>{
    var shorturl = request.params.shorturl;
    db.getDB().collection("urls").findOne({_id:shorturl},(err,result)=>{
        if(err){
            response.send("Error has occured");
        } else {
            if(result){
                response.redirect(result.longurl);
            } else {
                response.send("Invalid short URL");
            }
        }
    })
});

db.connect((err)=>{
    if(err){
        console.log("Error connecting to db");
        console.log(err);
    } else {
        console.log("Connected to DB");
        app.listen(PORT, ()=>{
            console.log("Listening to port : "+PORT);
        });
    }
});

