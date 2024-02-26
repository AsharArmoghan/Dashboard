const User = require("../Models/User");
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.CreateUser =  (req, res, next) => {

	console.log(req.body.email);
	Bcrypt.hash(req.body.password, 10)
		.then(hash => {
			const user = new User({
				username: req.body.username,
				email: req.body.email,
				password: hash,
			});
			if (!user) res.status(404).json({ message: "user not created" });

			user.save().then(createdUser => {
				res.status(200).json({ message: "User Created", createdUser: createdUser });

			});
		}).catch(() => res.status(500).json({ message: 'Invalid Authentication Credentials' }));
};

exports.login = async  (req, res, next) => {
	let fetchedUser;
	 await User.findOne({
		email: req.body.email,
	})

	.then(user => {
		if (!user) res.status(400).json({ message: "User not Found " });
		fetchedUser = user;
		return Bcrypt.compare(req.body.password, user.password);
	})

	.then(result => {
		if (!result)
			res.status(404).json({ message: "Invalid Credentials" });
		const token = jwt.sign({ email: fetchedUser.email, password: fetchedUser.password }, "jwtSecret", { algorithm: 'HS256', expiresIn: '1h' });

		if (!token) {
			res.status(400).json({message:'Invalid Credentials'})
		}

		res.status(200).json({
			token: token,
			expiresIn: '1h',
			userId: fetchedUser._id
		});

	}).catch(()=> res.status(400).json({message:'Something went Wrong! Plz try Again'}))
};
