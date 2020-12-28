var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
app.set('view engine', 'ejs');
app.use(express.static( __dirname + '/public'));

var PORT =  process.env.PORT || 3000;

var User = require('./models/user.js')

var allcountry_data, url_allcountry = 'https://disease.sh/v3/covid-19/countries/';
var india_data, url_india = 'https://disease.sh/v3/covid-19/countries/india';
var timeline_data, url_timeline = 'https://api.covid19india.org/data.json';
var state_data, url_state = 'https://api.covid19india.org/v2/state_district_wise.json';
var options = { json : true };

request(url_india, options, function(error, response, body){
    if(error || response.body.code==404){
        return
    }else{
        india_data = response.body;
    }
})

request(url_allcountry, options, function(error, response, body){
    if(error || response.body.code==404){
        return
    }else{
        allcountry_data = response.body;
    }
})

request(url_timeline, options, function(error, response, body){
    if(error || response.body.code==404){
        return
    }else{
        timeline_data = response.body.cases_time_series;
    }
});

request(url_state, options, function(error, response, body){
    if(error || response.body.code==404){
        return
    }else{
        state_data = response.body;

    }
});

app.get('/', function(req, res){
            
    res.render("index", { data : india_data });
});

app.get('/allcountry', function(req, res){

    res.render("allcountry",{ data : allcountry_data });
    
});

app.post("/country", function(req, res){

    var countryname = req.body.countryname;

    var jsonData = "";
    var url = 'https://disease.sh/v3/covid-19/countries/' + countryname;
    var options = { json : true };
    
    request(url, options, function(error, response, body){
        if(error || response.body.code==404){
            return res.render("error");
        }else{
            jsonData = response.body;
        }
        res.render("index",{ data : jsonData });
    });
    
});

app.get('/timeline', function(req, res){
    
    res.render("timeline",{ data : timeline_data });

});


app.get('/allstate', function(req, res){
    
    res.render("allstate",{ data : state_data });
    
});

var found;
app.get("/state/:name", function(req, res){
    var statename = req.params.name;
    
    state_data.forEach(function(search){
        if(statename==search.state){
            found = true;
            res.render("state", { data : search });
        }
    });
    
    if(found==false){
        res.render("errorstate", {data : jsonData});
    }

});

app.listen(PORT, function(){
    console.log("Server started..");
});
