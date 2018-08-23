const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'mbgame',
    password : '091157',
    database : 'smart-brain'
  }
});


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
	res.send(database.users);
});

app.post('/signin', (req,res)=> {
	const {email,password} = req.body;
	let isValid;
	db.select('*').from('login').where({email}).then(data=> { 

			bcrypt.compare(password, data[0].hash, function(err, res) {
    		isValid = res;
			});
			if(isValid){
				db.select('*').from('users').where({email}).then(user=>{
					res.json(user[0])
				})
				.catch(err=>{ res.status(400).json('user not found')})
				} else{
					res.status(400).json('username or password is incorrect')
				}

					
	})
	.catch(err=> { res.status(400).json('user name is invalid')	})


});

app.post('/register',(req,res)=> {
	const {email,password,name} = req.body;
	let hashPass;

	bcrypt.hash("bacon", null, null, function(err, hash) {
    hashPass=hash;
    console.log(hashPass);
})

	db.transaction(trx => {
		trx.insert({
			email : email,
			hash : hashPass
		}).into('login').returning('email')
		.then(loginEmail=> {
			return	trx('users').returning('*').insert({
				email : loginEmail[0] ,
				name : name , 
				joined : new Date()
				}).then(user => {
				res.json(user[0])
				})
			})
		.then(trx.commit)
		.catch(trx.rollback)
	})


	.catch(err=> res.status(400).json('u cant register'));
});

app.get('/profile/:id', (req,res)=> {
	const {id} = req.params;
	db.select('*').from('users').where({id}).then(user => {
		if(user.length){res.json(user[0])}
			else{res.status(400).json('user not found')}
		
	})
	.catch(err=> res.status(400).json('error in user'));
});

app.put('/image',(req,res)=> {
	const {id} = req.body;
	db('users').where('id' , '=' ,id).increment('entries',1).returning('entries')
	.then(entries => {res.json(entries)})
	.catch(err=> {res.status(400).json('user not found')})
})

app.listen(3000, ()=> {
	console.log('app is running');
}); 