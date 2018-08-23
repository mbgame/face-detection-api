
const registerControl = (req,res,db,bcrypt)=> {
	const {email,password,name} = req.body;
	let hashPass;

	bcrypt.hash(password, null, null, function(err, hash) {
    hashPass=hash;
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
}

module.exports = {
	registerControl: registerControl
};