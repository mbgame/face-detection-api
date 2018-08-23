const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const register = require('./controller/register');
const signin = require('./controller/signin');
const profile = require('./controller/profile');
const image = require('./controller/image');

const myPort = process.env.PORT || 3000;

const db = knex({
  client: 'pg',
  connection: {
    host : process.env.DATABASE_URL,
    user : 'mbgame',
    password : '091157',
    database : 'smart-brain'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {db.select('*').from('users').then(data=>{res.json(data);})});
app.post('/signin', (req,res)=> {signin.signinControl(req,res,db,bcrypt)});
app.post('/register',(req,res)=> {register.registerControl(req,res,db,bcrypt)});
app.get('/profile/:id', (req,res)=> {profile.profileControl(req,res,db)});
app.put('/image',(req,res)=> {image.imageControl(req,res,db)});
app.post('/imageurl',(req,res)=> {image.clarifaiApi(req,res)});
app.listen(myPort, ()=> {	console.log(`app is running on port ${myPort} `)});