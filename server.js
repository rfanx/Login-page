const express = require("express");
const app = express();
const hbs = require('hbs');
const session = require('express-session');
const nocache = require("nocache");

app.use(express.static('public'));
// this is the view engine of 'hbs'
app.set('view engine', 'hbs');

// predefined username and password
const username = "admin";
const password = "admin@123";

app.use(express.json());
app.use(express.urlencoded({extended: true}))

// session setteling
app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))


app.use(nocache())

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

// requist came inside this
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

app.get('/logout',(req,res) => {
    req.session.destroy()
    res.render('login',{msg:'Logged out'})
})

app.listen(4242, () => console.log('server running on port 4242'));
 