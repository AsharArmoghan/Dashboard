const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	userName: { type: "string",  },
	email: { type: "string", require: true, unique: true },
	password: { type: "string", require: true },
});

module.exports = mongoose.model("User", userSchema);
