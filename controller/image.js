const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '1c99b6eedc3a464fa89059c5050c3e1b'
});

const clarifaiApi = (req,res)=> {
	app.models.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
	.then(data=> {
		res.json(data);
	})
	.catch(err=> { res.status(400).json('clarifai api dose not work')})
}

const imageControl = (req,res,db)=> {
	const {id} = req.body;
	db('users').where('id' , '=' ,id).increment('entries',1).returning('entries')
	.then(entries => {res.json(entries)})
	.catch(err=> {res.status(400).json('user not found')})
}


module.exports = {
	imageControl,
	clarifaiApi
};