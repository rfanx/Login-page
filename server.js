const express = require("express");
const app = express();
// template engine
const hbs = require('hbs');
// for managing sessions
const session = require('express-session');
// middleware to disable caching 
const nocache = require("nocache");

app.use(express.static('public'));
// this is the view engine of 'hbs'
app.set('view engine', 'hbs');

// predefined username and password
const username = "admin";
const password = "admin@123";

// middleware parse incomming JSON and URL 
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// session setteling
app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

// disable caching to prevent serving cached pages 
app.use(nocache())

// handle rout
app.get('/',(req,res) => {
    if(req.session.user){
        res.render('home')
    }else{

        if(req.session.passwordwrong){
            res.render('login',{msg:"Invalid username or password"})
            req.session.passwordwrong = false
        }else{
            // linking with login page
            res.render('login');
        }
    }

})

// requist came inside this and handle login verification
app.post('/verify',(req,res) => {

    console.log(req.body);

    if (req.body.username === username && req.body.password === password) {
        req.session.user = req.body.username
        res.redirect('/home')
    }
    else {
        req.session.passwordwrong = true
        res.redirect('/')
    }
});

// route to handle home page
app.get('/home',(req,res) => {

    if(req.session.user){
        res.render('home')
    }else{
        if(req.session.passwordwrong){
            req.session.passwordwrong = false
            res.render('login', {msg: "Invalid username or password" });
        }else{
            res.render('login')
        }
        
    }
})

// route to handle logout
app.get('/logout',(req,res) => {
    req.session.destroy()
    res.render('login',{msg:'Logged out'})
})

app.listen(4242, () => console.log('server running on port 4242'));
 