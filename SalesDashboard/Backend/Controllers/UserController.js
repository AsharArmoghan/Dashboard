const User = require("../Models/User");
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
	let createduser;
	console.log(req.body.email);
	const user = await User.findOne({
		email: req.body.email,
	});
	if (user) {
		return res.status(400).json({ message: "User already register" });
	} else {
		await Bcrypt.hash(req.body.password, 10)
			.then((hash) => {
				const user = new User({
					username: req.body.username,
					email: req.body.email,
					password: hash,
				});
				createduser = user;
			})
			.catch(() => res.status(500).json({ error: "something went wrong" }));

		if (!createduser) res.status(404).json({ error: "user not created! Pls try again" });
		createduser.save();
		console.log(createduser);
		res.status(200).json({ message: "User Created", createduser: createduser });
	}
};
exports.login = async (req, res) => {
	let fetchedUser;
	await User.findOne({
		email: req.body.email,
	})
		.then((user) => {
			if (!user) {
				res.status(400).json({ message: "User not Found " });
			} else {
				fetchedUser = user;
				return Bcrypt.compare(req.body.password, user.password);
			}
		})
		.then((result) => {
			if (!result) {
				res.status(404).json({ message: "Invalid Credentials" });
			} else {
				const token = jwt.sign({ email: fetchedUser.email, password: fetchedUser.password }, process.env.SECRET, {
					algorithm: "HS256",
					expiresIn: "1h",
				});

				if (!token) {
					res.status(400).json({ message: "Invalid Credentials" });
				} else {
					res.status(200).json({
						token: token,
						expiresIn: "1h",
						userId: fetchedUser._id,
					});
				}
			}
		})
		.catch(() => res.status(400).json({ message: "Something went Wrong! Plz try Again" }));
};
