const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {secret:"mysupersecretstring", resave:false, saveUninitialized:true};                 

app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res)=>{
    let{name="ANONYMOUS"}= req.query;
    req.session.name = name;
    if(name==="ANONYMOUS"){
        req.flash("error","user not registered");
    }else{
        req.flash("success","User registered successfully");
    }
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.render("page.ejs", {name:req.session.name});
})
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`You sent the request ${req.session.count}times`);
// })

// app.get("/test", (req,res)=>{
//     res.send("Test successfull");
// })

// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-In", "India",{signed:true});  
//     res.send("signed cookie sent");
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("Verified");
// })

// app.get("/getcookie",(req,res)=>{
//     res.cookie("Greet","namaste");
//     res.cookie("madeIn","India");
//     res.send("sent you some cookies");
// });

// app.get("/greet", (req,res)=>{
//     let{name= "anonymous"}=req.cookies;
//     res.send(`Hi, ${name}`);
// })

// app.get("/", (req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi, I am root");
// })

// app.use("/users", users);

// app.use("/posts", posts);

app.listen(3000, ()=>{
    console.log("Server is listening to port 3000");
})