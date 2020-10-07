const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gamil.com',
			password: 'password',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'

		}

	]

}

app.use(express.json());
app.use(cors());

const findUser =(email) => {
	return index = database.users.findIndex(obj => obj.email === email);
}

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res)=>{

	const { email, password } = req.body;
	const i = findUser(email);

	console.log(email + ' ' + password + ' i=' + i);

	if (i >= 0) {
		if(bcrypt.compareSync(password, database.users[i].password)) {
			console.log(database.users[i]);
			res.json(database.users[i]);
		}else {
			res.status(403).json('Bad password');
		}

	} else{
		res.status(403).json('No Such User ID');
	}
	
	
})

app.post('/register', (req, res)=> {
	const {email, name, password } = req.body;

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);

	
	database.users.push ({
		id: '125',
		name: name,
		email: email,
		password: hash,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req,res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			res.json(user);
		} 
	})
	if (!found) {
		res.status(400).json('not found');
	}
	
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			res.json(user.entries);
		} 
	})
	if (!found) {
		res.status(400).json('not found');
	}

})

const port = process.env.port || 3001;
app.listen(port, ()=> {
	console.log('App is running on port 3001');
})