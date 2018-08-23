
const signinControl = (req,res,db,bcrypt)=> {
	const {email,password} = req.body;
	let isValid;
	db.select('*').from('login').where({email}).then(data=> { 

			bcrypt.compare(password, data[0].hash, function(err, ress) {
    		isValid = ress;
			if(isValid){
				db.select('*').from('users').where({email}).then(user=>{
					res.json(user[0])
				})
				.catch(err=>{ res.status(400).json('user not found')})
				} else{
					res.status(400).json('username or password is incorrect')
				}
				})
					
	})
	.catch(err=> { res.status(400).json('user name is invalid')	})
}

module.exports = {
	signinControl: signinControl
};