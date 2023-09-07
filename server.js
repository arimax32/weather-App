const express = require("express");
const ejs = require('ejs');
require("dotenv").config({path : "./data/config.env"});
const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/getWeather",async (req,res)=>{
    let cities = req.body.city;
    if(typeof(cities) === "string"){
        cities = [cities]
    }
    Promise.allSettled(cities.map(async city => {
        const response = await fetch(`${process.env.BASE_URL}${city}&aqi=no`);
        return response.json();
    }))
    .then(data => data.filter(info => info.status === "fulfilled")
                    .filter(info => info.value.error == null)
                    .map(info => ({  
                                    city : info.value.location.name, 
                                    tempC : info.value.current.temp_c
                                })))
    .then(weatherInfo => res.render("report.ejs",{reports : weatherInfo}));
})

app.listen(process.env.PORT, () => {console.log(`Server running on Port ${process.env.PORT}`)})