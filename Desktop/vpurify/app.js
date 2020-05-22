//jshint esversion:6
const express =require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose=require("mongoose")
var messagebird = require('messagebird')('lSeG8d2NuTn9IinXE6aKsn1Te');
const app=express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect('mongodb://localhost:27017/vpurifyDB',{useNewUrlParser:true, useUnifiedTopology:true });



const userSchema={
    email: String,
    name:String,
    password: String,
    phone:String,
    adress:String,
    vehicleType:String
    
}

const serviceSchema={
    email: String,
    name:String,
    password: String,
    phone:String,
    pin:String,
    slots:Array 
}





const User= new mongoose.model("User",userSchema);
const Service=new mongoose.model("Service",serviceSchema);


app.get("/",function(req,res){
    res.render("home")
})


app.get("/login",function(req,res){
    res.render("login");
})

app.get("/users",function(req,res){
    User.find({},function(err,users){
        res.render("users",{
            users:users
        })
    })

})

app.get("/services",function(req,res){
    Service.find({},function(err,services){
        res.render("services",{
            services:services
        })
    })
})

app.get("/userverify",function(req,res){
    res.render("userverify")
})

app.get("/userreg",function(req,res){
    res.render("userreg");
})

app.get("/servicereg",function(req,res){
    res.render("servicereg")
})

app.get("/search",function(req,res){
    res.render("search")
})

app.get("/result",function(req,res){
    res.render("result")
})

// app.get("/station/:stationName",function(req,res){
//     const requestedStationId=req.params.stationName;
//     Service.findOne({name:requestedStationId},function(err,station){
//         res.render("station"{

//         })
//     })
// })

// app.get("/station/:stationId",function(req,res){
//     const requestedStationId=req.params.stationId;

//     Service.findOne({_id:requestedStationId},function(err,slot){
//         res.render("addSlots")

// })
// })

// app.post("/add",function(req,res){
//     Service.update({name:req.body.name},{
//         $push:{
//             slots:req.body.newTime
//         }
//     })
    
// })


app.route("/station/:stationId")

.get(function(req,res){
    const requestedStationId=req.params.stationId;
    Service.findOne({_id:requestedStationId},function(err,station){
        res.render("addSlots")
    })
})

.post(function(req,res){
    const requestedStationId=req.params.stationId;
    Service.updateOne({_id:requestedStationId},{
                $push:{
                    slots:req.body.newTime
                },
                
            },
            {
                overwrite:true
            },
            function(err){
                if(!err){
                    res.redirect("/")
                }
                else{
                    console.log(err)
                }
            }
            )

})

app.get("/service/:stationName",function(req,res){
    const requestedStationName=req.params.stationName;
    Service.findOne({name: requestedStationName}, function(err, service){
		res.render("stationSlots", {
		//   image: blog.image,
          slot:service.slots		
        });
	  });
})



app.post("/search",function(req,res){
    var enteredPin= req.body.pin
    Service.find({pin:enteredPin},function(err,stations){
        if (err){
            console.log(err)
        }
        else{
        res.render("result",{
            stations:stations})
    }
    })
})


app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        name:req.body.name,
        phone:req.body.phone,
        password:req.body.password,
        vehicleType:req.body.vehicleType
    });
    newUser.save(function(err){
        if (err) {
            console.log(err)

        }
        else{
            res.render("secrets")
        }
    })
})



app.post("/reg",function(req,res){
    const newService = new Service({
        email:req.body.username,
        name:req.body.name,
        phone:req.body.phone,
        password:req.body.password,
        pin:req.body.pin
    });
    newService.save(function(err){
        if (err) {
            console.log(err)

        }
        else{
            res.render("addSlots")
        }
    })
})












app.listen(3000,function(){
    console.log("App is running")
})